import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import axios from 'axios'
import { Send, Loader2, MapPin, Clock, Lightbulb, Map, Info, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

interface PlanItem {
  time: string | null
  location: string
  activity: string
}

interface TripData {
  plan: {
    output: {
      intent: string
      preferences: {
        target_group: string | null
        budget: string | null
        style: string
      }
      missing_info: string[]
      plan: PlanItem[]
      reasoning: string[]
      tips: string[]
    }
  }
  strategy: string
  evaluation?: any
}

function RouteComponent() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tripData, setTripData] = useState<TripData | null>(null)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setTripData(null)

    try {
      const response = await axios.post('http://localhost:8000/analyze', {
        query: query,
        n_samples: 3,
        verify: true,
        evaluate: true
      })
      setTripData(response.data)
    } catch (err: any) {
      console.error('API Error:', err)
      setError(err.response?.data?.detail || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ API กรุณาตรวจสอบว่า Backend รันอยู่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* <!-- Main Input Section --> */}
      <main className={`transition-all duration-500 flex flex-col items-center justify-center px-4 ${tripData ? 'pt-10' : 'flex-1'}`}>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">เริ่มจัดแผนเที่ยวของคุณกัน !</h1>
        <p className="text-gray-600 mb-8">ใส่คำอธิบายการท่องเที่ยวที่คุณอยากไป เช่น "ไปเที่ยวคาเฟ่แถวอารีย์ 1 วัน งบ 1000 บาท"</p>

        {/* <!-- Input Box --> */}
        <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white rounded-2xl shadow-lg flex items-center px-6 py-2 border border-gray-100 focus-within:ring-2 focus-within:ring-[#839958] transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="เพิ่มรูปแบบการท่องเที่ยวที่คุณอยากไป..."
            className="flex-1 outline-none text-gray-700 py-3 bg-transparent"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`ml-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              loading || !query.trim() ? 'bg-gray-200 text-gray-400' : 'bg-[#839958] text-white hover:bg-[#6b7d48] shadow-md'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md max-w-3xl w-full flex items-start gap-3">
            <AlertTriangle className="text-red-500 mt-0.5" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </main>

      {/* <!-- Results Display --> */}
      {tripData && (
        <div className="max-w-5xl mx-auto w-full px-4 mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Strategy Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#839958]/5 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Map className="text-[#839958]" size={22} />
              <h2 className="text-xl font-bold text-gray-800">กลยุทธ์การเดินทาง (Trip Strategy)</h2>
            </div>
            <div className="p-6">
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {tripData.strategy}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan Timeline (2/3 width on LG) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Clock className="text-blue-600" size={22} />
                  <h2 className="text-xl font-bold text-gray-800">แผนการเดินทาง (Timeline)</h2>
                </div>
                <div className="p-6">
                  <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
                    {tripData.plan.output.plan.map((item, index) => (
                      <div key={index} className="relative pl-8">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded italic">
                            {item.time || 'N/A'}
                          </span>
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-1">
                            <MapPin size={16} className="text-red-500" />
                            {item.location}
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{item.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reasoning Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-orange-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Info className="text-orange-600" size={22} />
                  <h2 className="text-xl font-bold text-gray-800">ทำไมเราถึงเลือกที่นี่? (Reasoning)</h2>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    {tripData.plan.output.reasoning.map((reason, index) => (
                      <li key={index} className="flex gap-3 text-gray-700">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <p className="flex-1">{reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar (1/3 width on LG) */}
            <div className="space-y-6">
              {/* Preferences Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Info className="text-gray-600" size={20} />
                  <h2 className="text-lg font-bold text-gray-800">ข้อมูลของคุณ</h2>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">สไตล์</p>
                    <p className="text-gray-700 font-medium">{tripData.plan.output.preferences.style}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">งบประมาณ</p>
                    <p className="text-gray-700 font-medium">{tripData.plan.output.preferences.budget || 'ไม่ระบุ'}</p>
                  </div>
                  {tripData.plan.output.missing_info.length > 0 && (
                    <div className="pt-2 border-t border-gray-50">
                      <p className="text-xs uppercase tracking-wider text-red-400 font-bold mb-2">ข้อมูลที่อาจจำเป็นเพิ่ม</p>
                      <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                        {tripData.plan.output.missing_info.map((info, idx) => (
                          <li key={idx}>{info}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-[#839958] rounded-2xl shadow-md text-white overflow-hidden">
                <div className="bg-white/10 px-6 py-4 border-b border-white/10 flex items-center gap-2">
                  <Lightbulb size={20} />
                  <h2 className="text-lg font-bold">เทคนิคและคำแนะนำ</h2>
                </div>
                <div className="p-6 space-y-4">
                  {tripData.plan.output.tips.map((tip, index) => (
                    <div key={index} className="text-sm bg-white/10 p-3 rounded-xl border border-white/10">
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
