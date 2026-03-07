import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import trip6top from '../assets/poptrip/trip6-pop.jpg'
import trip6a from '../assets/poptrip/poptrip6-1.jpg'
import trip6b from '../assets/poptrip/poptrip6-2.jpg'
import trip6c from '../assets/poptrip/poptrip6-3.jpg'
import trip6d from '../assets/poptrip/poptrip6-4.webp'
import trip6e from '../assets/poptrip/poptrip6-5.png'
import trip6f from '../assets/poptrip/poptrip6-6.jpeg'
import trip6g from '../assets/poptrip/poptrip6-7.jpg'

export const Route = createFileRoute('/poptrip6')({ component: PopTrip1 })

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
          backgroundImage: `url(${trip6top})`,
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
        >ทริปโรแมนติกที่ทะเลตะวันออก</h1>
        <h3
          className="relative z-10 text-gray-500 font-bold tracking-wide pb-8 text-center"
          style={{ animation: 'heroFadeUp 0.9s 0.2s ease both' }}
        >สัมผัสบรรยากาศสุดโรแมนติกริมชายฝั่งของทะเลตะวันออกของประเทศไทย 3 วัน 2 คืน <br />
          เพลิดเพลินกับวิวทะเลสวย น้ำใส และช่วงเวลาพักผ่อนท่ามกลางบรรยากาศเงียบสงบ เหมาะสำหรับการท่องเที่ยวกับคนพิเศษ</h3>
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
                  <p className="font-semibold text-gray-700 text-lg">สาย:</p>
                  <p className="leading-relaxed">
                    พักผ่อนริมทะเลที่หาดคุ้งวิมาน ชายหาดที่เงียบสงบและสวยงาม <br />
                    เหมาะสำหรับการเดินเล่นรับลมทะเล ก่อนขึ้นไปชมวิวทิวทัศน์ <br />
                    ชายฝั่งโค้งยาวอันงดงามจากจุดชมวิวเนินนางพญา</p>
                </div>
                <div style={{ minHeight: 140 }}>
                  <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                  <p className="leading-relaxed">
                    เดินศึกษาธรรมชาติท่ามกลางระบบนิเวศป่าชายเลนที่อุดมสมบูรณ์ <br />
                    ที่ศูนย์ศึกษาการพัฒนาอ่าวคุ้งกระเบน สัมผัสบรรยากาศร่มรื่นของผืนป่า <br />
                    พร้อมเรียนรู้ความสำคัญของป่าชายเลนต่อระบบนิเวศชายฝั่ง🌿🌊🦀</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                  <p className="leading-relaxed">
                    พักผ่อนริมทะเลที่หาดเจ้าหลาว ชายหาดยอดนิยมของจันทบุรี <br />
                    ก่อนแวะซื้ออาหารทะเลสดและของกินพื้นบ้านจากตลาดในชุมชนหาดเจ้าหลาว <br />
                    เพื่ออิ่มอร่อยกับมื้อเย็นท่ามกลางบรรยากาศริมทะเล🦐🍽️</p>
                </div>
              </div>
            </Reveal>

            {/* Images – slides in from right */}
            <Reveal tx={40} ty={0} delay={200} className="flex flex-col gap-3 flex-1">
              <img src={trip6a} className="w-full object-cover rounded-xl" style={{ height: 380 }} />
              <div className="flex gap-4">
                <img src={trip6b} className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                <img src={trip6c} className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
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
                <img src={trip6d} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="w-[40%]">
                <img src={trip6e} className="w-full h-full object-cover rounded-xl" />
              </div>
            </div>
            <div className="w-full pt-2">
              <img src={trip6f} className="w-full aspect-[16/9] object-cover rounded-xl" />
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
                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 140 }} />
                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 140 }} />
                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
              </div>
              <div className="flex flex-col text-base text-gray-500">
                <div style={{ minHeight: 160 }}>
                  <p className="font-semibold text-gray-700 text-lg">เช้า – สาย:</p>
                  <p className="leading-relaxed">
                    เดินชมธรรมชาติบนสะพานไม้ท่ามกลางผืนป่าโกงกาง <br />
                    สีทองอร่ามที่ทุ่งโปรงทอง สัมผัสความงดงามของป่าชายเลน <br />
                    ที่เปล่งประกายยามต้องแสงแดดและบรรยากาศ <br />
                    เงียบสงบของธรรมชาติ</p>
                </div>
                <div style={{ minHeight: 160 }}>
                  <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                  <p className="leading-relaxed">
                    พายเรือคายัคชมธรรมชาติท่ามกลางสายน้ำ <br />
                    และพืชพรรณเขียวชอุ่มของวนพฤกษศาสตร์ระยอง <br />
                    สัมผัสบรรยากาศเงียบสงบของป่าชุ่มน้ำและความอุดมสมบูรณ์ของระบบนิเวศ</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                  <p className="leading-relaxed">
                    เดินชมทัศนียภาพทะเลกว้างและโขดหินริมชายฝั่ง <br />
                    ที่เขาแหลมหญ้า จุดชมวิวธรรมชาติภายในอุทยานแห่งชาติ <br />
                    เขาแหลมหญ้า–หมู่เกาะเสม็ด ที่มีบรรยากาศเงียบสงบ <br />
                    เหมาะสำหรับการถ่ายภาพและชมพระอาทิตย์ตกเหนือท้องทะเล🌊🌅📸</p>
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
                  <p className="leading-relaxed">
                    เดินชมความงดงามของไม้ดอกเมืองหนาวหลากสีสันที่สวนดอกไม้เมืองหนาวระยอง <br />
                    เพลิดเพลินกับบรรยากาศสวนดอกไม้ที่สดใสและมุมถ่ายภาพสวยงาม ก่อนออกเดินทางกลับโดยสวัสดิภาพ</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 3 equal images side by side */}
          <Reveal ty={30} delay={200}>
            <div className="flex gap-4 mt-8">
              <img src={trip6g} alt="day3-2" className="flex-1 w-0 object-cover rounded-xl" style={{ height: 400, width: '100%' }} />
              {/* <img src={trip6i} alt="day3-3" className="flex-1 w-0 object-cover rounded-xl" style={{ height: 300 }} /> */}
            </div>
          </Reveal>
        </div>

      </div>

    </div>
  )
}
