import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import slide1 from '../assets/life-festive/cover.jpg'

// md
import md1 from '../assets/life-festive/md1.webp'
import md2 from '../assets/life-festive/md2.webp'
import md3 from '../assets/life-festive/md3.jpg'
import md4 from '../assets/life-festive/md4.webp'


// northeast
import ne1 from '../assets/life-festive/ne1.webp'
import ne2 from '../assets/life-festive/ne2.jpg'
import ne3 from '../assets/life-festive/ne3.jpg'
import ne4 from '../assets/life-festive/ne4.jpg'
import ne5 from '../assets/life-festive/ne5.jpg'
import ne6 from '../assets/life-festive/ne6.jpeg'


// north
import north1 from '../assets/life-festive/north1.jpg'
import north2 from '../assets/life-festive/north2.jpg'
import north3 from '../assets/life-festive/north3.jpg'
import north4 from '../assets/life-festive/north4.jpg'
import north5 from '../assets/life-festive/north5.jpg'
import north6 from '../assets/life-festive/north6.jpeg'
import north7 from '../assets/life-festive/north7.jpg'


// south
import south1 from '../assets/life-festive/south1.jpg'
import south2 from '../assets/life-festive/south2.jpg'
import south3 from '../assets/life-festive/south3.jpg'

export const Route = createFileRoute('/lifestyle-festive')({ component: LifestyleTemple })

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
// NORTH
const northFestivalCards = [
  { img: north1, name: 'เชียงใหญ่เฟส', location: 'Chiang Mai (พฤศจิกายน)', mapUrl: 'https://maps.app.goo.gl/P1i9zZuHrzAf95xC7' },
  { img: north2, name: 'Singha Park International Balloon Fiesta', location: 'Chiang Rai (กุมภาพันธ์)', mapUrl: 'https://maps.app.goo.gl/dUUSzB1AkMx4HDX89' },
  { img: north3, name: 'Farm Festival', location: 'Chiang Mai (พฤศจิกายน-ธันวาคม)', mapUrl: 'https://maps.app.goo.gl/t2bNa4JPLioS2Ehs6' },
  { img: north4, name: 'งานลอยกระทงสุโขทัย', location: 'Sukhothai (พฤศจิกายน)', mapUrl: 'https://maps.app.goo.gl/itUpmoPJzBLBtywg6' },
  { img: north5, name: 'งานยี่เป็งภาคเหนือ', location: 'Chiang Mai (พฤศจิกายน)', mapUrl: 'https://www.facebook.com/YiPengchiangmaifestival/' },
  { img: north6, name: 'ประเพณีลอยกระทงสายไหลประทีปพันดวง', location: 'Tak (พฤศจิกายน)', mapUrl: 'https://maps.app.goo.gl/HPiu2Q3htNKfKHSU9' },
  { img: north7, name: 'เทศกาลชมดอกไม้เมืองหนาว', location: 'Chiang Mai (ธันวาคม-กุมภาพันธ์)', mapUrl: 'https://maps.app.goo.gl/yroM341jFFTt7tk67' },
]

// NORTHEAST
const northeastFestivalCards = [
  { img: ne1, name: 'BigMountain Music Festival', location: 'Nakhon Ratchasima (ธันวาคม)', mapUrl: 'https://www.facebook.com/bigmountainmusicfestival/' },
  { img: ne2, name: 'บุญบั้งไฟ', location: 'Yasothon (พฤษภาคม)', mapUrl: 'https://maps.app.goo.gl/pUg7GoWqWFqS78iT7' },
  { img: ne3, name: 'ประเพณีไหลเรือไฟ', location: 'Nakhon Phanom (ตุลาคม)', mapUrl: 'https://maps.app.goo.gl/u9ngPij6enLV3pVe6' },
  { img: ne4, name: 'ผีตาโขน', location: 'Loei (มิถุนายน-กรกฎาคม)', mapUrl: 'https://maps.app.goo.gl/xn6wUUYAasE5rvd3A' },
  { img: ne5, name: 'เชียงคาน เฟสติวัล', location: 'Loei (ตุลาคม-พฤศจิกายน)', mapUrl: 'https://www.facebook.com/p/%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B8%84%E0%B8%B2%E0%B8%99-%E0%B9%80%E0%B8%9F%E0%B8%AA%E0%B8%95%E0%B8%B4%E0%B8%A7%E0%B8%B1%E0%B8%A5-Chiangkhan-Festival-100090890044547/' },
  { img: ne6, name: 'ประเพณีออกพรรษาเชียงคาน', location: 'Loei (ตุลาคม)', mapUrl: 'https://maps.app.goo.gl/4B9BzsqUCxLu2LBP8' },
]

// BANGKOK & CENTRAL
const bangkokFestivalCards = [
  { img: md1, name: 'สงกรานต์ ข้าวสาร', location: 'Bangkok (เมษายน)', mapUrl: 'https://maps.app.goo.gl/QfkwBghpifpvrW8h8' },
  { img: md2, name: 'เคาท์ดาวน์ปีใหม่ วัดอรุณ', location: 'Bangkok (ธันวาคม-มกราคม)', mapUrl: 'https://maps.app.goo.gl/JtY8Pfga3p3nJUfDA' },
  { img: md3, name: 'ดูพลุพัทยา', location: 'Chonburi (มกราคม)', mapUrl: 'https://maps.app.goo.gl/5K9sdsCRpan7Kh7P8' },
  { img: md4, name: 'งานวิจิตรเจ้าพระยา', location: 'Bangkok (ธันวาคม)', mapUrl: 'https://maps.app.goo.gl/KsT8nDE3TkncPhSz9' },
]

// SOUTH
const southFestivalCards = [
  { img: south1, name: 'สารทเดือนสิบ (ชิงเปรต)', location: 'Nakhon Si Thammarat (กันยายน-ตุลาคม)', mapUrl: 'https://maps.app.goo.gl/r7vdmK2XoJfcbWZX8' },
  { img: south2, name: 'ชักพระ', location: 'Surat Thani (ตุลาคม)', mapUrl: 'https://www.facebook.com/chakphra.surat/' },
  { img: south3, name: 'แห่ผ้าขึ้นธาตุ', location: 'Nakhon Si Thammarat (วันมาฆบูชา และวันวิสาขบูชา)', mapUrl: 'https://maps.app.goo.gl/Xia13J9SKoGkaoFv7' }
]

function RegionSection({ title, cards }: { title: string; cards: typeof bangkokFestivalCards }) {
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
            color: 'rgba(255,255,255,0.95)',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        >{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-9 h-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-lg pb-0.5 backdrop-blur-sm"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="w-9 h-9 rounded-full border border-white/40 text-white flex items-center justify-center hover:bg-white/20 transition-colors text-lg pb-0.5 backdrop-blur-sm"
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(9,8,58,0.3) 50%, rgba(9,8,58,0.7) 80%, #09083A 100%)' }} />
      </section>

      {/* ── bg wrapper: intro + regions share the same bg ── */}
      <div className="bg-[#09083A]">
        {/* ── Intro text ── */}
        <section className="max-w-3xl mx-auto px-10 pt-10 pb-6 text-center">
          <h2
            className="text-lg font-bold mb-2"
            style={{
              color: 'rgba(255,255,255,0.95)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            }}
          >ตรงใจไลฟ์สไตล์สาย festive</h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'rgba(220,210,255,0.85)',
              textShadow: 'none',
            }}
          >
            เหมาะสำหรับผู้ที่ชื่นชอบบรรยากาศงานเทศกาลและความสนุกสนานของกิจกรรมพิเศษในแต่ละช่วงเวลา ไม่ว่าจะเป็นเทศกาลดนตรี
            งานวัฒนธรรม หรืออีเวนต์เฉลิมฉลองที่เต็มไปด้วยสีสัน การท่องเที่ยวสไตล์นี้ได้รับความนิยมอย่างมากในกลุ่มคนรุ่นใหม่อย่าง Gen Z
            ที่ต้องการออกไปสัมผัสประสบการณ์ใหม่ ๆ สนุกกับบรรยากาศคึกคัก และสร้างความทรงจำร่วมกับกลุ่มเพื่อน🎉🎶✨
          </p>
        </section>

        <RegionSection title="Bankok & Central region" cards={bangkokFestivalCards} />
        <RegionSection title="North" cards={northFestivalCards} />
        <RegionSection title="NorthEast" cards={northeastFestivalCards} />
        <RegionSection title="South" cards={southFestivalCards} />

        {/* ── CTA Button ── */}
        <div className="flex justify-center py-12">
          <Link
            to="/about"
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 24px rgba(150,130,255,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: 'rgba(240,230,255,0.95)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              textShadow: '0 0 12px rgba(200,180,255,0.6)',
              transition: 'box-shadow 0.25s, background 0.25s, transform 0.2s',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(150,130,255,0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(150,130,255,0.2), inset 0 1px 0 rgba(255,255,255,0.15)'
            }}
          >
            ลองจัดทริปในสไตล์ของคุณดูสิ !
          </Link>
        </div>
      </div >
    </>
  )
}
