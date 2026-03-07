import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import trip2top from '../assets/poptrip/trip2-hero.jpg'
import trip2a from '../assets/poptrip/poptrip2-1.png'
import trip2b from '../assets/poptrip/poptrip2-2.jpg'
import trip2c from '../assets/poptrip/poptrip2-3.webp'
import trip2d from '../assets/poptrip/poptrip2-4.jpg'
import trip2e from '../assets/poptrip/poptrip2-5.jpg'
import trip2f from '../assets/poptrip/poptrip2-6.jpeg'
import trip2g from '../assets/poptrip/poptrip2-7.jpg'
import trip2h from '../assets/poptrip/poptrip2-8.jpeg'
import trip2i from '../assets/poptrip/poptrip2-9.jpg'
import trip2j from '../assets/poptrip/poptrip2-10.jpg'
import trip2k from '../assets/poptrip/poptrip2-11.png'
import trip2l from '../assets/poptrip/poptrip2-12.jpg'
import trip2m from '../assets/poptrip/poptrip2-13.jpg'

export const Route = createFileRoute('/poptrip2')({ component: PopTrip1 })

// ── Scroll Reveal Hook ──────────────────────────────────────────────────
function useScrollReveal(options?: IntersectionObserverInit) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true)
                observer.disconnect()
            }
        }, { threshold: 0.12, ...options })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])
    return { ref, visible }
}

// ── Reveal wrapper styles ───────────────────────────────────────────────
const revealBase: React.CSSProperties = {
    transition: 'opacity 1.1s ease, transform 1.1s ease',
}
const hidden = (tx = 0, ty = 40): React.CSSProperties => ({
    opacity: 0,
    transform: `translate(${tx}px, ${ty}px)`,
})
const show: React.CSSProperties = { opacity: 1, transform: 'translate(0,0)' }

// ── Reveal component ────────────────────────────────────────────────────
function Reveal({
    children,
    tx = 0,
    ty = 40,
    delay = 0,
    className,
}: {
    children: React.ReactNode
    tx?: number
    ty?: number
    delay?: number
    className?: string
    style?: React.CSSProperties
}) {
    const { ref, visible } = useScrollReveal()
    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...revealBase,
                transitionDelay: `${delay}ms`,
                ...(visible ? show : hidden(tx, ty)),
            }}
        >
            {children}
        </div>
    )
}

// ── Main Component ──────────────────────────────────────────────────────
function PopTrip1() {
    return (
        <div className="relative min-h-screen bg-white">

            {/* ── Hero ── */}
            <section
                className="w-full relative flex flex-col items-center justify-end -mt-20"
                style={{
                    height: 650,
                    backgroundImage: `url(${trip2top})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* gradient fade to white at bottom */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(
                        to bottom,
                        transparent 0%,
                        rgba(255,255,255,0.05) 55%,
                        rgba(255,255,255,0.15) 63%,
                        rgba(255,255,255,0.35) 70%,
                        rgba(255,255,255,0.55) 76%,
                        rgba(255,255,255,0.72) 82%,
                        rgba(255,255,255,0.85) 88%,
                        rgba(255,255,255,0.93) 93%,
                        rgba(255,255,255,0.97) 97%,
                        white 100%
                    )`
                    }}
                />

                {/* Hero text – animates in on load */}
                <h1
                    className="relative z-10 text-gray-600 text-4xl font-bold tracking-wide pb-2"
                    style={{
                        textShadow: '0 1px 3px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.6)',
                        animation: 'heroFadeUp 0.9s ease both',
                    }}
                >ทริปรับลมหนาวที่ภาคเหนือ</h1>
                <h3
                    className="relative z-10 text-gray-500 font-bold tracking-wide pb-8 text-center"
                    style={{ animation: 'heroFadeUp 0.9s 0.2s ease both' }}
                >สัมผัสอากาศหนาวสุดฟิน พร้อมธรรมชาติสุดปังในเวลา 5 วัน 4 คืน <br />
                    ทริปนี้จะพาคุณไปสัมผัสธรรมชาติสุด classic ของ 2 จังหวัดทางภาคเหนือเชียงใหม่และเชียงราย <br />
                    พร้อมสีสันของดอกไม้นานาชนิดที่กำลังบานอย่างสวยงามในช่วงฤดูหนาว</h3>
            </section>

            {/* keyframes injected inline */}
            <style>{`
        @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        img { transition: opacity 0.3s ease, transform 0.4s ease; }
        img:hover { opacity: 0.82; transform: scale(1.01); }
    `}</style>


            {/* ── Day Sections ── */}
            <div className="max-w-6xl mx-auto px-12 py-16 flex flex-col gap-28">

                {/* ── DAY 01 ── */}
                <div>
                    {/* Day header */}
                    <Reveal ty={30}>
                        <div className="flex flex-col items-start">
                            <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>01</span>
                            <div className="flex items-center gap-2" style={{ marginTop: -6 }}>
                                <div className="h-px w-12 bg-[#7DA2B6]" />
                                <span className="text-sm text-[#7DA2B6] font-medium">Start day1</span>
                            </div>
                        </div>
                    </Reveal>

                    <div className="flex gap-8 mt-6">
                        {/* Timeline – slides in from left */}
                        <Reveal tx={-40} ty={0} delay={100} className="flex gap-5 shrink-0" style={{ width: '45%' } as React.CSSProperties}>
                            <div className="flex flex-col items-center pt-1">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                            </div>
                            <div className="flex flex-col text-base text-gray-500">
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">เช้า:</p>
                                    <p className="leading-relaxed">เดินทางไปแม่ริมและแวะร้าน Fleur Cafe and Eatery <br /> ที่กำลังมีมุมดอกกุหลาบสวยๆให้ได้ถ่ายรูป</p>
                                </div>
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                                    <p className="leading-relaxed">
                                        แวะสวนพฤกษศาสตร์สมเด็จพระนางเจ้าสิริกิติ์ แม่ริม <br />
                                        เที่ยวชมพืชพรรณนานาชนิดและเดิน Canopy walkway <br />
                                        ทางเดินลอยฟ้าเหนือเรือนยอดไม้ที่ยาวที่สุดในประเทศไทย <br />
                                        มองเห็นวิวสวยๆ ของภูเขาและท้องฟ้า</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                                    <p className="leading-relaxed">เข้าที่พักที่เชียงใหม่<br />และแวะเดินเล่นถนนคนเดินท่าแพ</p>
                                </div>
                            </div>
                        </Reveal>

                        {/* Images – slides in from right */}
                        <Reveal tx={40} ty={0} delay={200} className="flex flex-col gap-3 flex-1">
                            <img src={trip2a} className="w-full object-cover rounded-xl" style={{ height: 380 }} />
                            <div className="flex gap-4">
                                <img src={trip2b} className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                                <img src={trip2c} className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* ── DAY 02 ── */}
                <div className="flex gap-8 items-start">
                    {/* Images – slides in from left */}
                    <Reveal tx={-40} ty={0} delay={100} className="w-full max-w-xl mx-auto p-2 mt-40">
                        <div className="flex flex-row items-stretch gap-2">
                            <div className="w-[60%]">
                                <img src={trip2d} className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div className="w-[40%]">
                                <img src={trip2e} className="w-full h-full object-cover rounded-xl" />
                            </div>
                        </div>
                        <div className="w-full pt-2">
                            <img src={trip2m} className="w-full aspect-[16/9] object-cover rounded-xl" />
                        </div>
                    </Reveal>

                    {/* Right side: header + timeline – slides in from right */}
                    <Reveal tx={40} ty={0} delay={200} className="flex-1 pt-2">
                        <div className="flex flex-col items-end">
                            <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>02</span>
                            <div className="flex items-center gap-2 flex-row-reverse" style={{ marginTop: -6 }}>
                                <div className="h-px w-12 bg-[#7DA2B6]" />
                                <span className="text-sm text-[#7DA2B6] font-medium">Start day2</span>
                            </div>
                        </div>
                        <div className="flex gap-5 mt-6">
                            <div className="flex flex-col items-center pt-1">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                            </div>
                            <div className="flex flex-col text-base text-gray-500">
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">เช้า – สาย:</p>
                                    <p className="leading-relaxed">ขึ้นไปที่บ้านขุนช่างเคี่ยนชมวิวหมู่ยอดเขา <br />ที่เต็มไปด้วยดอกนางพญาเสือโคร่งที่ <br /> บานสะพรั่งทั่วทั้งดอยและชมวิวดอยปุย</p>
                                </div>
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                                    <p className="leading-relaxed">เที่ยวชมพระตำหนักภูพิงคราชนิเวศน์ <br />โดยมีทั้งดอกกุหลาบพันปีสวยๆที่บานสะพรั่ง <br />ละดอกไม้อื่นๆที่ตกแต่งอย่างสวยงาม</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                                    <p className="leading-relaxed">แวะทำบุญและชมวิวตัวเมืองเชียงใหม่ที่ <br />วัดพระธาตุดอยสุเทพ <br />ต่อด้วยหาของกินที่ย่านนิมมาน</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* ── DAY 03 ── */}
                <div>
                    {/* Day header – centered */}
                    <Reveal ty={30}>
                        <div className="flex flex-col items-center">
                            <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>03</span>
                            <div className="flex items-center gap-2" style={{ marginTop: -6 }}>
                                <div className="h-px w-12 bg-[#7DA2B6]" />
                                <span className="text-sm text-[#7DA2B6] font-medium">Start day3</span>
                                <div className="h-px w-12 bg-[#7DA2B6]" />
                            </div>
                        </div>
                    </Reveal>

                    {/* 3 columns: dot + label + text */}
                    <Reveal ty={20} delay={100}>
                        <div className="flex gap-6 mt-10">
                            {/* สาย */}
                            <div className="flex-1 flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6] shrink-0 mt-1" />
                                <div className="text-base text-gray-500">
                                    <p className="font-semibold text-gray-700 text-lg">สาย:</p>
                                    <p className="leading-relaxed">ไหว้หลวงพ่อทันใจที่วัดพระธาตุ<br />ดอยคำและเดินทางไป<br />จังหวัดเชียงราย</p>
                                </div>
                            </div>
                            {/* บ่าย */}
                            <div className="flex-1 flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6] shrink-0 mt-1" />
                                <div className="text-base text-gray-500">
                                    <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                                    <p className="leading-relaxed">ดื่มชากาแฟและชมวิวภูเขาสวยๆ<br />แวะคาเฟ่ชิวๆที่ดอยช้าง</p>
                                </div>
                            </div>
                            {/* เย็น */}
                            <div className="flex-1 flex gap-3 items-start">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6] shrink-0 mt-1" />
                                <div className="text-base text-gray-500">
                                    <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                                    <p className="leading-relaxed">แวะเที่ยวakha farm ville<br />เพื่อดูพระอาทิตย์ตกพร้อมน้อง<br />แกะน่ารักๆและเช็คอินที่พักดอย<br />ช้างและทานอาหารเย็น</p>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* 3 equal images side by side */}
                    <Reveal ty={30} delay={200}>
                        <div className="flex gap-4 mt-8">
                            <img src={trip2f} alt="day3-1" className="flex-1 w-0 object-cover rounded-xl" style={{ height: 220 }} />
                            <img src={trip2g} alt="day3-2" className="flex-1 w-0 object-cover rounded-xl" style={{ height: 220 }} />
                            <img src={trip2h} alt="day3-3" className="flex-1 w-0 object-cover rounded-xl" style={{ height: 220 }} />
                        </div>
                    </Reveal>
                </div>

                {/* ── DAY 04 ── */}
                <div>
                    {/* Day header */}
                    <Reveal ty={30}>
                        <div className="flex flex-col items-start">
                            <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>04</span>
                            <div className="flex items-center gap-2" style={{ marginTop: -6 }}>
                                <div className="h-px w-12 bg-[#7DA2B6]" />
                                <span className="text-sm text-[#7DA2B6] font-medium">Start day4</span>
                            </div>
                        </div>
                    </Reveal>

                    <div className="flex gap-8 mt-6">
                        {/* Timeline – slides in from left */}
                        <Reveal tx={-40} ty={0} delay={100} className="flex gap-5 shrink-0" style={{ width: '45%' } as React.CSSProperties}>
                            <div className="flex flex-col items-center pt-1">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                            </div>
                            <div className="flex flex-col text-base text-gray-500">
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">เช้า:</p>
                                    <p className="leading-relaxed">แวะทุ่งดอกไฮเดรนเยียที่ไฮเดรนเยียซัง<br />ออกเดินทางไปภูชี้ฟ้า</p>
                                </div>
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                                    <p className="leading-relaxed">เข้าที่พักที่ภูชี้ฟ้าและเดินทางไปชมวิวที่ภูชี้ดาว</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                                    <p className="leading-relaxed">กลับเข้าที่พักที่ภูชี้ฟ้าและทานอาหารเย็น <br />เป็นเซ็ตหมูกระทะที่ที่พักเตรียมไว้ให้</p>
                                </div>
                            </div>
                        </Reveal>

                        {/* Images – slides in from right */}
                        <Reveal tx={40} ty={0} delay={200} className="flex flex-col gap-3 flex-1">
                            <img src={trip2i} className="w-full object-cover rounded-xl" style={{ height: 380 }} />
                            <div className="flex gap-4">
                                <img src={trip2k} className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                                <img src={trip2top} className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                            </div>
                        </Reveal>
                    </div>
                </div>

                {/* ── DAY 05 ── */}
                <div className="flex gap-8 items-start">
                    {/* Images – slides in from left */}
                    <Reveal tx={-40} ty={0} delay={100} className="w-full max-w-xl mx-auto p-2 mt-40">
                        <div className="flex flex-row items-stretch gap-2">
                            <img src={trip2j} className="w-full h-[200px] object-cover rounded-xl" />
                        </div>
                        <div className="w-full pt-2">
                            <img src={trip2l} className="w-full h-[300px] object-cover rounded-xl" />
                        </div>
                    </Reveal>

                    {/* Right side: header + timeline – slides in from right */}
                    <Reveal tx={40} ty={0} delay={200} className="flex-1 pt-2">
                        <div className="flex flex-col items-end">
                            <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>05</span>
                            <div className="flex items-center gap-2 flex-row-reverse" style={{ marginTop: -6 }}>
                                <div className="h-px w-12 bg-[#7DA2B6]" />
                                <span className="text-sm text-[#7DA2B6] font-medium">Start day5</span>
                            </div>
                        </div>
                        <div className="flex gap-5 mt-6">
                            <div className="flex flex-col items-center pt-1">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                            </div>
                            <div className="flex flex-col text-base text-gray-500">
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">เช้า – สาย:</p>
                                    <p className="leading-relaxed">นั่งรถและเดินขึ้นไปชมวิวทะเลหมอก <br />และพระอาทิตย์ขึ้นที่ภูชี้ฟ้า</p>
                                </div>
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                                    <p className="leading-relaxed">เดินทางไปยังสนามบินเชียงรายเพื่อเดินทางกลับ <br />
                                        Optional: แวะร้าน Aquatale cafe ร้านวิวสวย <br /> สูดอากาศจากธรรมชาติอย่างเต็มอิ่มพร้อมชิมอาหารและเครื่องดื่มราคาน่ารัก ที่สำคัญร้านอยู่ใกล้สนามบิน
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

            </div>

        </div>
    )
}
