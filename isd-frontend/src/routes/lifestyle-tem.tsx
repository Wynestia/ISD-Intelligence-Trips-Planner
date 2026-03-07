import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import slide1 from '../assets/life-tem/cover.jpg'

// md
import md1 from '../assets/life-tem/md1.jpg'
import md2 from '../assets/life-tem/md2.jpg'
import md3 from '../assets/life-tem/md3.webp'
import md4 from '../assets/life-tem/md4.jpg'
import md5 from '../assets/life-tem/md5.jpg'
import md6 from '../assets/life-tem/md6.webp'
import md7 from '../assets/life-tem/md7.jpg'


// northeast
import ne1 from '../assets/life-tem/ne1.jpg'
import ne2 from '../assets/life-tem/ne2.jpg'
import ne3 from '../assets/life-tem/ne3.jpg'
import ne5 from '../assets/life-tem/ne5.jpg'
import ne4 from '../assets/life-tem/noe4.jpg'   // ตามชื่อไฟล์ในรูป


// north
import north1 from '../assets/life-tem/north1.jpg'
import north2 from '../assets/life-tem/north2.jpeg'
import north3 from '../assets/life-tem/north3.jpg'
import north4 from '../assets/life-tem/north4.jpg'
import north5 from '../assets/life-tem/north5.jpg'
import north6 from '../assets/life-tem/north6.jpeg'
import north7 from '../assets/life-tem/north7.jpg'


// south
import south1 from '../assets/life-tem/south1.jpg'
import south2 from '../assets/life-tem/south2.jpg'
import south3 from '../assets/life-tem/south3.jpg'
import south4 from '../assets/life-tem/south4.jpg'
import south5 from '../assets/life-tem/south5.jpg'
import south6 from '../assets/life-tem/south6.png'

export const Route = createFileRoute('/lifestyle-tem')({ component: LifestyleTemple })

// Location pin SVG icon
function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

// Card data for each region
// BANGKOK & CENTRAL
const bangkokTempleCards = [
  { img: md1, name: 'วัดโพธิ์', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/ZP4pYVuY6BH2BJkt7' },
  { img: md2, name: 'วัดอรุณ', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/msfzhBy42HVgFmnq8' },
  { img: md3, name: 'วัดพระแก้ว', location: 'Bangkok', mapUrl: 'https://share.google/UwYn50pw0fiIQWPCj' },
  { img: md4, name: 'วัดสุทัศน์', location: 'Bangkok', mapUrl: 'https://share.google/ZxLtJ9Z421CCRUUPS' },
  { img: md5, name: 'วัดสระเกษ', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/JSyAmMrJioLqxCzZ6' },
  { img: md6, name: 'วัดมหาธาตุ', location: 'Ayutthaya', mapUrl: 'https://maps.app.goo.gl/XRBrcTQNX9FWuChZ6' },
  { img: md7, name: 'วัดไชยวัฒนาราม', location: 'Ayutthaya', mapUrl: 'https://share.google/CO7slvs2vqDduYJOw' },
]

// NORTH
const northTempleCards = [
  { img: north1, name: 'วัดพระธาตุดอยสุเทพราชวรวิหาร', location: 'Chiang Mai', mapUrl: 'https://share.google/rjf4dXQTpdsuNjnNY' },
  { img: north2, name: 'วัดพระธาตุดอยตุง', location: 'Chiang Rai', mapUrl: 'https://share.google/1cGwjCEjXqxeADM4Q' },
  { img: north3, name: 'วัดร่องขุ่น', location: 'Chiang Rai', mapUrl: 'https://share.google/jm2GEuMZFCCroY41f' },
  { img: north4, name: 'วัดพระธาตุหริภุญชัยวรมหาวิหาร', location: 'Lamphun', mapUrl: 'https://share.google/gZNUblJInigAFbK6z' },
  { img: north5, name: 'วัดภูมินทร์', location: 'Nan', mapUrl: 'https://share.google/DRJ9sxR2pUB6rzKZE' },
  { img: north6, name: 'วัดนันตาราม', location: 'Chiang Rai', mapUrl: 'https://share.google/R1gRWIYQE3vHMc9MC' },
  { img: north7, name: 'วัดพระธาตุลำปางหลวง', location: 'Lampang', mapUrl: 'https://share.google/vndWq2v2ItDwGuV9M' },
]

// NORTHEAST
const northeastTempleCards = [
  { img: ne1, name: 'วัดพระธาตุพนมวรมหาวิหาร', location: 'Nakhon Phanom', mapUrl: 'https://share.google/EoUn2DTjydbYmsmGI' },
  { img: ne2, name: 'วัดพระธาตุเชิงชุมวรวิหาร', location: 'Sakon Nakhon', mapUrl: 'https://share.google/B2Aild1ZZJd4JYtXY' },
  { img: ne3, name: 'วัดภูทอก', location: 'Bueng Kan', mapUrl: 'https://share.google/GmsKeiwfxYm1N3aqe' },
  { img: ne4, name: 'วัดรอยพระพุทธบาทภูมโนรมย์', location: 'Mukdahan', mapUrl: 'https://share.google/78lIj5SfmESLRIyLq' },
  { img: ne5, name: 'วัดป่าวังน้ำเย็น', location: 'Sakon Nakhon', mapUrl: 'https://share.google/6VeYzvfgRy6iPtoUU' },
]

// SOUTH
const southTempleCards = [
  { img: south1, name: 'วัดพระมหาธาตุวรมหาวิหาร', location: 'Nakhon Si Thammarat', mapUrl: 'https://share.google/8qUOgU3lP3Vdj8vWS' },
  { img: south2, name: 'วัดเจดีย์', location: 'Nakhon Si Thammarat', mapUrl: 'https://share.google/IfoGLxzT1hmGjbeq3' },
  { img: south3, name: 'วัดพระบรมธาตุไชยาราชวรวิหาร', location: 'Surat Thani', mapUrl: 'https://share.google/MLCBi2xYuHa4SPjOw' },
  { img: south4, name: 'วัดถ้ำเสือ', location: 'Krabi', mapUrl: 'https://share.google/fyir51Lwui3oydocz' },
  { img: south5, name: 'วัดฉลอง (วัดไชยธาราราม)', location: 'Phuket', mapUrl: 'https://share.google/xGzEzA8nwMFfsRtO2' },
  { img: south6, name: 'วัดช้างให้ราษฎร์บูรณาราม', location: 'Pattani', mapUrl: 'https://share.google/dPHVn93w6pGuTuLRV' },
]

function RegionSection({ title, cards }: { title: string; cards: typeof bangkokTempleCards }) {
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)

  const scrollLeft = () => scrollRef?.scrollBy({ left: -(scrollRef.offsetWidth * 0.8), behavior: 'smooth' })
  const scrollRight = () => scrollRef?.scrollBy({ left: scrollRef.offsetWidth * 0.8, behavior: 'smooth' })

  return (
    <section className="py-10">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-10 flex items-center justify-between mb-5">
        <h2
          className="text-2xl font-bold"
          style={{
            color: 'rgba(75,50,30,0.92)',
            textShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        >{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-9 h-9 rounded-full border border-white/40 text-gray-600 flex items-center justify-center hover:bg-white/30 transition-colors text-lg pb-0.5 backdrop-blur-sm"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="w-9 h-9 rounded-full border border-white/40 text-gray-600 flex items-center justify-center hover:bg-white/30 transition-colors text-lg pb-0.5 backdrop-blur-sm"
          >
            ›
          </button>
        </div>
      </div>

      {/* Scrollable cards row */}
      <div className="max-w-6xl mx-auto px-10 overflow-hidden">
        <div
          ref={setScrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2"
        >
          {cards.map((card, idx) => (
            <a
              key={idx}
              href={card.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="snap-start flex-none overflow-hidden rounded-2xl relative group"
              style={{
                width: 'calc(25% - 12px)',
                minWidth: 180,
                height: 320,
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: '0 2px 16px rgba(80,110,130,0.15)',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {/* Full-card image */}
              <img
                src={card.img}
                alt={card.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient overlay — bottom panel */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-4"
                style={{
                  background: 'linear-gradient(to top, rgba(30,60,80,0.75) 0%, rgba(30,60,80,0.35) 60%, transparent 100%)',
                }}
              >
                {/* Liquid glass name text */}
                <p
                  className="font-bold text-sm leading-snug mb-1"
                  style={{
                    color: 'rgba(255,255,255,0.92)',
                    textShadow: [
                      '0 1px 0 rgba(255,255,255,0.55)',
                      '0 -1px 0 rgba(0,0,0,0.25)',
                      '0 0 12px rgba(180,230,255,0.5)',
                      '1px 1px 2px rgba(0,40,80,0.4)',
                    ].join(', '),
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  {card.name}
                </p>
                {/* Liquid glass location */}
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{
                    color: 'rgba(180,230,255,0.88)',
                    textShadow: '0 1px 0 rgba(255,255,255,0.3), 0 0 8px rgba(120,200,255,0.5)',
                  }}
                >
                  <PinIcon />
                  <span>{card.location}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function LifestyleTemple() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="w-full relative flex items-center justify-center -mt-18"
        style={{ height: 520, backgroundImage: `url(${slide1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* gradient fade to blue-gray — smooth multi-stop */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(59,59,59,0.05) 50%, rgba(210,196,180,0.55) 80%, #F0E9DF 100%)' }} />
      </section>

      {/* ── bg wrapper: intro + regions share the same bg ── */}
      <div className="bg-[#F0E9DF]">
        {/* ── Intro text ── */}
        <section className="max-w-3xl mx-auto px-10 pt-10 pb-6 text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              color: 'rgba(75,50,30,0.92)',
              textShadow: '0 1px 2px rgba(0,0,0,0.12)',
            }}
          >ตรงใจไลฟ์สไตล์สายบุญ สายมู</h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'rgba(75,50,30,0.92)',
              textShadow: 'none',
            }}
          >
            เหมาะสำหรับผู้ที่ชื่นชอบการท่องเที่ยวเชิงวัฒนธรรมและการเสริมสิริมงคลในชีวิต ไม่ว่าจะเป็นการไหว้พระ ทำบุญ
            หรือเยี่ยมชมสถานที่ศักดิ์สิทธิ์ที่มีชื่อเสียง ปัจจุบันยังได้รับความนิยมในกลุ่มคนรุ่นใหม่อย่าง Gen Z
            ที่สนใจการท่องเที่ยวเชิงความเชื่อ ควบคู่กับการเที่ยวชมเมืองและสัมผัสบรรยากาศวัฒนธรรมร่วมกับครอบครัวหรือกลุ่มเพื่อน🙏✨🏯
          </p>
        </section>

        <RegionSection title="Bankok & Central region" cards={bangkokTempleCards} />
        <RegionSection title="North" cards={northTempleCards} />
        <RegionSection title="NorthEast" cards={northeastTempleCards} />
        <RegionSection title="South" cards={southTempleCards} />

        {/* ── CTA Button ── */}
        <div className="flex justify-center py-12">
          <Link
            to="/about"
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.10)',
              border: '1.5px solid rgba(255,255,255,0.55)',
              boxShadow: '0 4px 24px rgba(120,90,60,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: 'rgba(75,50,30,0.92)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              textShadow: '0 1px 0 rgba(255,255,255,0.7), 0 0 12px rgba(200,160,100,0.4)',
              transition: 'box-shadow 0.25s, background 0.25s, transform 0.2s',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.20)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(120,90,60,0.28), inset 0 1px 0 rgba(255,255,255,0.6)'
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(120,90,60,0.18), inset 0 1px 0 rgba(255,255,255,0.5)'
            }}
          >
            ลองจัดทริปในสไตล์ของคุณดูสิ !
          </Link>
        </div>
      </div >
    </>
  )
}
