import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

const API = 'http://localhost:3123'

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChatMessage {
    message_id: number
    session_id: number
    role: 'user' | 'ai'
    content: string
    token_count: number
    create_at: string
}

interface ChatSession {
    chat_id: number
    user_id: number
    title: string
    create_at: string
    messages: ChatMessage[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getToken(): string | null { return localStorage.getItem('token') }

function authHeaders(): HeadersInit {
    const token = getToken()
    return token
        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        : { 'Content-Type': 'application/json' }
}

function tryParseJSON(content: string): unknown | null {
    try {
        const v = JSON.parse(content)
        return (typeof v === 'object' && v !== null) ? v : null
    } catch { return null }
}

// ── Key label helpers ─────────────────────────────────────────────────────────
const KEY_EMOJI: Record<string, string> = {
    plan: '🗺️', output: '📋', intent: '🎯', preferences: '⚙️',
    missing_info: '❓', reasoning: '💭', tips: '💡', evaluation: '📊',
    scores: '📈', feedback: '📝', recommendation: '✅', budget: '💰',
    target_group: '👥', style: '✨', total_score: '⭐', location: '📍',
    time: '🕐', activity: '🏃', accuracy: '🎯', relevance: '🔗',
    logistics: '🚌', safety_tips: '🛡️',
}

function formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function labelFor(key: string): string {
    const emoji = KEY_EMOJI[key.toLowerCase()] ?? ''
    return `${emoji} ${formatKey(key)}`.trim()
}

// ── Section color palette (cycles by depth) ───────────────────────────────────
const SECTION_COLORS = [
    { bg: '#f5f2ee', border: '#c4cbb9', label: '#8D957E' },   // sage-green border + sage-green label
    { bg: '#f0f4ff', border: '#c8d8f8', label: '#3a5ba0' },
    { bg: '#f8fdf6', border: '#d4e8cc', label: '#4a7040' },
    { bg: '#fffbf0', border: '#f0dfa0', label: '#a07820' },
    { bg: '#f5f2ee', border: '#d6c9b8', label: '#78898F' },   // ivory-sand + stormy-sky
    { bg: '#f0fafa', border: '#b8e0e0', label: '#307070' },
]

function colorAt(depth: number) { return SECTION_COLORS[depth % SECTION_COLORS.length] }

// ── Recursive JSON Value Renderer ─────────────────────────────────────────────
function JsonValue({ value, depth = 0 }: { value: unknown; depth?: number }): React.ReactElement {
    // null
    if (value === null) {
        return <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '12px' }}>—</span>
    }

    // boolean
    if (typeof value === 'boolean') {
        return (
            <span style={{
                background: value ? '#dcfce7' : '#fee2e2',
                color: value ? '#166534' : '#991b1b',
                borderRadius: '12px', padding: '1px 8px', fontSize: '11px', fontWeight: 600,
            }}>
                {value ? 'ใช่' : 'ไม่ใช่'}
            </span>
        )
    }

    // number
    if (typeof value === 'number') {
        return (
            <span style={{ fontWeight: 700, color: '#3a5ba0', fontSize: '13px' }}>
                {Number.isInteger(value) ? value : value.toFixed(2)}
            </span>
        )
    }

    // string
    if (typeof value === 'string') {
        if (value.length < 120) {
            return <span style={{ fontSize: '13px', color: '#2d1f1a', lineHeight: 1.6 }}>{value}</span>
        }
        return <p style={{ margin: 0, fontSize: '13px', color: '#2d1f1a', lineHeight: 1.6 }}>{value}</p>
    }

    const c = colorAt(depth)

    // array
    if (Array.isArray(value)) {
        if (value.length === 0) return <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>

        const allPrimitive = value.every(v => typeof v !== 'object' || v === null)

        if (allPrimitive) {
            return (
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {value.map((v, i) => (
                        <li key={i} style={{ fontSize: '13px', color: '#2d1f1a', lineHeight: 1.5 }}>{String(v)}</li>
                    ))}
                </ul>
            )
        }

        // array of objects → numbered mini-cards
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {value.map((v, i) => (
                    <div key={i} style={{
                        background: c.bg, border: `1px solid ${c.border}`,
                        borderRadius: '8px', padding: '8px 12px',
                        display: 'flex', gap: '10px', alignItems: 'flex-start',
                    }}>
                        <div style={{
                            minWidth: '24px', height: '24px', borderRadius: '50%',
                            background: c.label, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: 700, flexShrink: 0, marginTop: '2px',
                        }}>
                            {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                            <JsonValue value={v} depth={depth + 1} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // object
    if (typeof value === 'object') {
        const entries = Object.entries(value as Record<string, unknown>)
            .filter(([k]) => k.toLowerCase() !== 'strategy') // [ลบ Strategy ออกจาก output]

        if (entries.length === 0) return <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                {entries.map(([k, v]) => {
                    const isComplex = typeof v === 'object' && v !== null
                    const col = colorAt(depth)

                    if (isComplex) {
                        return (
                            <div key={k} style={{
                                background: col.bg, border: `1px solid ${col.border}`,
                                borderRadius: '10px', overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '6px 12px', borderBottom: `1px solid ${col.border}`,
                                    fontSize: '12px', fontWeight: 700, color: col.label,
                                }}>
                                    {labelFor(k)}
                                </div>
                                <div style={{ padding: '10px 12px' }}>
                                    <JsonValue value={v} depth={depth + 1} />
                                </div>
                            </div>
                        )
                    }

                    // inline key: value for primitives
                    return (
                        <div key={k} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#78898f', flexShrink: 0 }}>
                                {labelFor(k)}:
                            </span>
                            <JsonValue value={v} depth={depth} />
                        </div>
                    )
                })}
            </div>
        )
    }

    return <span style={{ fontSize: '13px' }}>{String(value)}</span>
}

// ── Top-level card wrapper ────────────────────────────────────────────────────
function JsonCard({ data }: { data: unknown }) {
    return (
        <div style={{ width: '100%' }}>
            <JsonValue value={data} depth={0} />
        </div>
    )
}

// ── Route ─────────────────────────────────────────────────────────────────────
export const Route = createFileRoute('/about')({
    component: RouteComponent,
})

function RouteComponent() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!getToken())
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [activeSession, setActiveSession] = useState<number | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [creatingSession, setCreatingSession] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onAuth = () => {
            setIsLoggedIn(!!getToken())
            setSessions([])
            setActiveSession(null)
            setMessages([])
        }
        window.addEventListener('auth-change', onAuth)
        return () => window.removeEventListener('auth-change', onAuth)
    }, [])

    const fetchSessions = async () => {
        try {
            const res = await fetch(`${API}/chat/sessions`, { headers: authHeaders() })
            if (!res.ok) return
            setSessions(await res.json())
        } catch (e) { console.error(e) }
    }

    useEffect(() => { if (isLoggedIn) fetchSessions() }, [isLoggedIn])

    useEffect(() => {
        if (activeSession === null) return
        setLoadingMessages(true)
        setMessages([])
        fetch(`${API}/chat/sessions/${activeSession}/messages`, { headers: authHeaders() })
            .then(r => r.json())
            .then((data: ChatMessage[]) => setMessages(data))
            .catch(e => console.error(e))
            .finally(() => setLoadingMessages(false))
    }, [activeSession])

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

    const handleNewChat = async () => {
        setCreatingSession(true)
        try {
            const title = `แชทใหม่ ${new Date().toLocaleTimeString('th-TH')}`
            const res = await fetch(`${API}/chat/sessions`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ title }),
            })
            const session: ChatSession = await res.json()
            await fetchSessions()
            setActiveSession(session.chat_id)
            setMessages([])
        } catch (e) { console.error(e) }
        finally { setCreatingSession(false) }
    }

    const handleDeleteSession = async (chatId: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('คุณต้องการลบบทสนทนานี้ใช่หรือไม่?')) return
        try {
            const res = await fetch(`${API}/chat/sessions/${chatId}`, {
                method: 'DELETE',
                headers: authHeaders()
            })
            if (res.ok) {
                if (activeSession === chatId) {
                    setActiveSession(null)
                    setMessages([])
                }
                fetchSessions()
            }
        } catch (err) { console.error(err) }
    }

    const handleClearHistory = async () => {
        if (!activeSession) return
        if (!confirm('คุณต้องการล้างประวัติข้อความในแชทนี้ใช่หรือไม่?')) return
        try {
            const res = await fetch(`${API}/chat/sessions/${activeSession}/messages`, {
                method: 'DELETE',
                headers: authHeaders()
            })
            if (res.ok) {
                setMessages([])
                fetchSessions() // Sync sidebar preview
            }
        } catch (err) { console.error(err) }
    }

    const handleSend = async () => {
        if (!input.trim() || activeSession === null || sending) return
        const text = input.trim()
        setInput('')
        setSending(true)

        const tempUser: ChatMessage = {
            message_id: Date.now(), session_id: activeSession,
            role: 'user', content: text, token_count: 0,
            create_at: new Date().toISOString(),
        }
        setMessages(prev => [...prev, tempUser])

        try {
            const res = await fetch(`${API}/chat/sessions/${activeSession}/messages`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ content: text }),
            })
            const { userMessage, aiMessage } = await res.json()
            setMessages(prev => [
                ...prev.filter(m => m.message_id !== tempUser.message_id),
                userMessage, aiMessage,
            ])
        } catch (e) { console.error(e) }
        finally { setSending(false) }
    }

    const activeSessionData = sessions.find(s => s.chat_id === activeSession)

    // ── Not logged in ──────────────────────────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <div style={{ display: 'flex', height: 'calc(100vh - 64px)', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', background: '#f5f2ee', fontFamily: "'Segoe UI', sans-serif" }}>
                <span style={{ fontSize: '56px' }}>🗺️</span>
                <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#2d2e2b' }}>กรุณาเข้าสู่ระบบก่อน</h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#78898F' }}>เพื่อดูและสร้างแผนการเดินทางของคุณ</p>
                <Link
                    to='/login'
                    style={{ marginTop: '8px', padding: '10px 28px', borderRadius: '10px', background: 'linear-gradient(135deg,#8D957E,#6e7a62)', color: '#fff', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}
                >
                    เข้าสู่ระบบ
                </Link>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* ── Sidebar ────────────────────────────────────────────────────────── */}
            <aside style={{ width: '268px', minWidth: '220px', background: '#fff', display: 'flex', flexDirection: 'column', borderRight: '1px solid #c4cbb9' }}>
                <div style={{ padding: '18px 16px 12px' }}>
                    <button
                        onClick={handleNewChat} disabled={creatingSession}
                        style={{ width: '100%', padding: '10px 16px', borderRadius: '10px', border: '1px solid #8D957E', background: '#8D957E', color: '#fff', fontSize: '14px', fontWeight: 500, cursor: creatingSession ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseOver={e => { e.currentTarget.style.background = '#6e7a62' }}
                        onMouseOut={e => { e.currentTarget.style.background = '#8D957E' }}
                    >
                        <span style={{ fontSize: '18px' }}>＋</span>
                        {creatingSession ? 'กำลังสร้าง...' : 'แชทใหม่'}
                    </button>
                </div>

                <div style={{ padding: '0 16px 8px', color: '#78898F', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    ประวัติการสนทนา
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
                    {sessions.length === 0 && (
                        <p style={{ color: '#78898F', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>ยังไม่มีประวัติการสนทนา</p>
                    )}
                    {sessions.map(s => {
                        // Sidebar preview: extract a readable snippet from content
                        const rawPreview = s.messages?.[0]?.content ?? ''
                        let previewText = rawPreview
                        try {
                            const p = JSON.parse(rawPreview)
                            // Try known text fields for a useful snippet
                            const intent = p?.output?.intent ?? p?.plan?.output?.intent ?? p?.intent
                            previewText = intent ? `🎯 ${intent}` : '📄 JSON'
                        } catch { /* plain text */ }

                        const isActive = s.chat_id === activeSession
                        return (
                            <div key={s.chat_id} style={{ position: 'relative', marginBottom: '2px' }} className="session-item-container">
                                <button
                                    onClick={() => { setActiveSession(s.chat_id); setMessages([]) }}
                                    style={{ width: '100%', textAlign: 'left', padding: '10px 42px 10px 12px', borderRadius: '8px', border: 'none', background: isActive ? 'rgba(141,149,126,0.2)' : 'transparent', color: isActive ? '#8D957E' : '#5a6350', cursor: 'pointer' }}
                                    onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'rgba(141,149,126,0.1)' }}
                                    onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                                >
                                    <div style={{ fontWeight: isActive ? 600 : 500, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>💬 {s.title}</div>
                                    {previewText && (
                                        <div style={{ fontSize: '11px', color: isActive ? '#8D957E' : '#78898F', marginTop: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {previewText}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '10px', color: '#78898F', marginTop: '2px' }}>
                                        {new Date(s.create_at).toLocaleDateString('th-TH')}
                                    </div>
                                </button>
                                <button
                                    className="delete-session-btn"
                                    onClick={(e) => handleDeleteSession(s.chat_id, e)}
                                    style={{
                                        position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                        background: 'transparent', border: 'none', color: '#78898F', cursor: 'pointer',
                                        fontSize: '14px', padding: '4px', opacity: isActive ? 1 : 0, transition: 'opacity 0.2s'
                                    }}
                                    title="ลบบทสนทนา"
                                >
                                    🗑️
                                </button>
                            </div>
                        )
                    })}
                </div>
            </aside>

            {/* ── Main Chat Area ──────────────────────────────────────────────────── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f0f2ee', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #c4cbb9', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '64px' }}>
                    {activeSessionData
                        ? <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '20px' }}>💬</span>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '15px', color: '#8D957E' }}>{activeSessionData.title}</div>
                                <div style={{ fontSize: '12px', color: '#78898F' }}>{messages.length} ข้อความ</div>
                            </div>
                        </div>
                        : <div style={{ fontSize: '15px', color: '#8D957E' }}>เลือกการสนทนาหรือสร้างแชทใหม่</div>
                    }

                    {activeSessionData && (
                        <button
                            onClick={handleClearHistory}
                            style={{
                                background: 'transparent', border: '1px solid #c4cbb9', borderRadius: '8px',
                                padding: '6px 12px', fontSize: '12px', color: '#78898F', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '6px'
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#991b1b'; e.currentTarget.style.borderColor = '#fecaca' }}
                            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#78898F'; e.currentTarget.style.borderColor = '#c4cbb9' }}
                        >
                            <span>🧹</span> ล้างแชท
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {!activeSession && !loadingMessages && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#8D957E', gap: '12px', paddingTop: '80px' }}>
                            <span style={{ fontSize: '56px' }}>🗺️</span>
                            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#8D957E' }}>เริ่มจัดแผนเที่ยวของคุณ!</h2>
                            <p style={{ margin: 0, fontSize: '14px', color: '#78898F' }}>เลือกการสนทนาจากด้านซ้าย หรือสร้างแชทใหม่</p>
                        </div>
                    )}
                    {loadingMessages && (
                        <div style={{ textAlign: 'center', color: '#78898F', fontSize: '14px', padding: '32px 0' }}>กำลังโหลด...</div>
                    )}

                    {messages.map(msg => {
                        const isUser = msg.role === 'user'
                        const jsonData = !isUser ? tryParseJSON(msg.content) : null

                        return (
                            <div key={msg.message_id} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: '10px', alignItems: 'flex-start' }}>
                                {!isUser && (
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#78898f,#8d957e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '4px' }}>🤖</div>
                                )}
                                <div style={{ maxWidth: isUser ? '65%' : '80%', minWidth: 0 }}>
                                    {isUser ? (
                                        <div style={{ padding: '12px 16px', borderRadius: '18px 18px 4px 18px', background: 'linear-gradient(135deg,#8D957E,#6e7a62)', color: '#fff', fontSize: '14px', lineHeight: '1.55', boxShadow: '0 2px 8px rgba(141,149,126,0.3)' }}>
                                            {msg.content}
                                        </div>
                                    ) : jsonData !== null ? (
                                        <div style={{ background: '#fff', border: '1px solid #c4cbb9', borderRadius: '4px 18px 18px 18px', padding: '14px 16px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
                                            <JsonCard data={jsonData} />
                                        </div>
                                    ) : (
                                        <div style={{ padding: '12px 16px', borderRadius: '4px 18px 18px 18px', background: '#fff', border: '1px solid #c4cbb9', color: '#2d2e2b', fontSize: '14px', lineHeight: '1.55', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                                            {msg.content}
                                        </div>
                                    )}
                                    <div style={{ fontSize: '11px', color: '#78898F', marginTop: '4px', textAlign: isUser ? 'right' : 'left', paddingLeft: isUser ? 0 : '4px', paddingRight: isUser ? '4px' : 0 }}>
                                        {new Date(msg.create_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                {isUser && (
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#8D957E,#6e7a62)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, marginTop: '4px' }}>👤</div>
                                )}
                            </div>
                        )
                    })}

                    {/* AI typing */}
                    {sending && (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#78898F,#8D957E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>🤖</div>
                            <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: '#fff', border: '1px solid #c4cbb9', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                                {[0, 1, 2].map(i => (
                                    <span key={i} style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#8D957E', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Bar */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid #c4cbb9', background: '#fff' }}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f0f2ee', borderRadius: '14px', border: '1.5px solid #c4cbb9', padding: '8px 8px 8px 18px' }}
                        onFocusCapture={e => { e.currentTarget.style.borderColor = '#8D957E' }}
                        onBlurCapture={e => { e.currentTarget.style.borderColor = '#c4cbb9' }}
                    >
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                            placeholder={activeSession ? 'บอกเล่าความต้องการการเดินทางของคุณ... (Enter ส่ง, Shift+Enter ขึ้นบรรทัดใหม่)' : 'เลือกการสนทนาก่อนเพื่อเริ่มพูดคุย'}
                            disabled={!activeSession || sending}
                            rows={1}
                            style={{ flex: 1, border: 'none', background: 'transparent', resize: 'none', outline: 'none', fontSize: '14px', color: '#2d2e2b', lineHeight: '1.5', maxHeight: '120px', overflowY: 'auto', fontFamily: 'inherit' }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!activeSession || !input.trim() || sending}
                            style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', flexShrink: 0, background: (!activeSession || !input.trim() || sending) ? '#c4cbb9' : 'linear-gradient(135deg,#8D957E,#6e7a62)', color: (!activeSession || !input.trim() || sending) ? '#78898F' : '#fff', cursor: (!activeSession || !input.trim() || sending) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}
                        >➤</button>
                    </div>
                </div>
            </main>

            <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .session-item-container:hover .delete-session-btn {
          opacity: 1 !important;
        }
      `}</style>
        </div>
    )
}
