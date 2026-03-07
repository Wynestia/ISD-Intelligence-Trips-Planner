import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import slide1 from '../assets/life-nature/cover.png'

// north
// md (bangkok)
import md1 from '../assets/life-nature/md1.jpg'
import md2 from '../assets/life-nature/md2.jpg'
import md3 from '../assets/life-nature/md3.png'
import md4 from '../assets/life-nature/md4.jpg'
import md5 from '../assets/life-nature/md5.jpg'
import md6 from '../assets/life-nature/md6.jpeg'
import md7 from '../assets/life-nature/md7.jpg'
import md8 from '../assets/life-nature/md8.jpg'
import md9 from '../assets/life-nature/md9.jpg'
import md10 from '../assets/life-nature/md10.jpg'


// northeast (ne)
import ne1 from '../assets/life-nature/ne1.webp'
import ne2 from '../assets/life-nature/ne2.jpg'
import ne3 from '../assets/life-nature/ne3.webp'
import ne4 from '../assets/life-nature/ne4.jpg'
import ne5 from '../assets/life-nature/ne5.jpg'
import ne6 from '../assets/life-nature/ne6.jpg'
import ne7 from '../assets/life-nature/ne7.jpeg'
import ne8 from '../assets/life-nature/ne8.jpg'
import ne9 from '../assets/life-nature/ne9.jpg'


// north
import north1 from '../assets/life-nature/north1.jpg'
import north2 from '../assets/life-nature/north2.jpg'
import north3 from '../assets/life-nature/north3.jpg'
import north4 from '../assets/life-nature/north4.jpg'
import north5 from '../assets/life-nature/north5.jpg'
import north6 from '../assets/life-nature/north6.jpg'
import north7 from '../assets/life-nature/north7.jpg'
import north8 from '../assets/life-nature/north8.jpg'
import north9 from '../assets/life-nature/north9.jpeg'
import north10 from '../assets/life-nature/north10.jpg'
import north11 from '../assets/life-nature/north11.jpg'
import north12 from '../assets/life-nature/north12.jpg'
import north13 from '../assets/life-nature/north13.jpg'
import north14 from '../assets/life-nature/north14.jpg'


// south
import south1 from '../assets/life-nature/south1.jpg'
import south2 from '../assets/life-nature/south2.jpg'
import south3 from '../assets/life-nature/south3.jpg'
import south4 from '../assets/life-nature/south4.jpeg'
import south5 from '../assets/life-nature/south5.jpg'
import south6 from '../assets/life-nature/south6.jpg'
import south7 from '../assets/life-nature/south7.jpg'
import south8 from '../assets/life-nature/south8.webp'

export const Route = createFileRoute('/lifestyle-nature')({ component: LifestyleNature })

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
// BANGKOK (md images)
// BANGKOK & CENTRAL
const bangkokNatureCards = [
  { img: md1, name: 'สวนป่าเบญจกิติ', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/mcozU1vPBjQcafoN6' },
  { img: md2, name: 'บางกระเจ้า', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/XPyULr3PgEKEHysJ6' },
  { img: md3, name: 'สวนพฤกษาศาสตร์ระยอง', location: 'Rayong', mapUrl: 'https://maps.app.goo.gl/rLnKXNoDcKfyxJJs8' },
  { img: md4, name: 'จุดชมวิวคุ้งวิมาน', location: 'Chanthaburi', mapUrl: 'https://maps.app.goo.gl/fnnFKe7M5MZZ2syTA' },
  { img: md5, name: 'อ่าวคุ้งกระเบน', location: 'Chanthaburi', mapUrl: 'https://maps.app.goo.gl/c64dSaaAzkTxgxV49' },
  { img: md6, name: 'เขาแหลมหญ้า', location: 'Rayong', mapUrl: 'https://maps.app.goo.gl/Cxbm54dcv2w3mtQq6' },
  { img: md7, name: 'น้ำตกสาริกา', location: 'Nakhon Nayok', mapUrl: 'https://maps.app.goo.gl/5MHYoykh2zgjugUQ6' },
  { img: md8, name: 'น้ำตกช่องลม', location: 'Nakhon Nayok', mapUrl: 'https://maps.app.goo.gl/zpVxJcSe61xL9RzE7' },
  { img: md9, name: 'น้ำตกเอราวัณ', location: 'Kanchanaburi', mapUrl: 'https://maps.app.goo.gl/CearyD2a9oZZzQMA7' },
  { img: md10, name: 'น้ำตกเจ็ดสาวน้อย', location: 'Saraburi', mapUrl: 'https://maps.app.goo.gl/RAJhApeSuRojdqKv7' },
]

// NORTH
const northNatureCards = [
  { img: north1, name: 'ดอยอินทนนท์-กิ่วแม่ปาน', location: 'Chiang Mai', mapUrl: 'https://maps.app.goo.gl/rT43mdpKgcekzUok9' },
  { img: north2, name: 'ดอยหลวงเชียงดาว', location: 'Chiang Mai', mapUrl: 'https://maps.app.goo.gl/QFu9jyXnvRhnMkjbA' },
  { img: north3, name: 'สวนพฤกษศาสตร์สมเด็จพระนางเจ้าสิริกิติ์', location: 'Chiang Mai', mapUrl: 'https://maps.app.goo.gl/eiNPL9zjWztHrTaT7' },
  { img: north4, name: 'ดอยผาตั้ง', location: 'Chiang Rai', mapUrl: 'https://maps.app.goo.gl/oGxBnVoXnQoCXx2N7' },
  { img: north5, name: 'ดอยช้าง', location: 'Chiang Rai', mapUrl: 'https://maps.app.goo.gl/MJN6oGCLHhChXAdX6' },
  { img: north6, name: 'ทุ่งไฮเดรนเยียดอยช้าง', location: 'Chiang Rai', mapUrl: 'https://maps.app.goo.gl/r88zhgPRkn3qpJ2CA' },
  { img: north7, name: 'ดอยตุง', location: 'Chiang Rai', mapUrl: 'https://maps.app.goo.gl/TsFeu7cML7yuTi8T7' },
  { img: north8, name: 'ดอยช้างมูบ', location: 'Chiang Rai', mapUrl: 'https://maps.app.goo.gl/a33uZhp8AWSAdkmv9' },
  { img: north9, name: 'ทุ่งแสลงหลวง', location: 'Phitsanulok', mapUrl: 'https://maps.app.goo.gl/ZCNi1JKfCr6wiQmg9' },
  { img: north10, name: 'น้ำตกคลองลาน', location: 'Kamphaeng Phet', mapUrl: 'https://maps.app.goo.gl/3uWJCCm6nbPBPmQH7' },
  { img: north11, name: 'ปางอุ๋ง', location: 'Mae Hong Son', mapUrl: 'https://maps.app.goo.gl/vXfMqgED34Hsyj9J7' },
  { img: north12, name: 'บ้านรักษ์ไทย', location: 'Mae Hong Son', mapUrl: 'https://maps.app.goo.gl/ZCpNpjKUJECjLsev5' },
  { img: north13, name: 'ดอยภูคา', location: 'Nan', mapUrl: 'https://maps.app.goo.gl/TaaZ1jK1CYEkwhit5' },
  { img: north14, name: 'ภูสอยดาว', location: 'Uttaradit', mapUrl: 'https://maps.app.goo.gl/rNw7Upzbxtjjz1SC7' },
]

// NORTHEAST
const northeastNatureCards = [
  { img: ne1, name: 'ภูลมโล', location: 'Loei', mapUrl: 'https://maps.app.goo.gl/8rQuHw1MgB1U7jx88' },
  { img: ne2, name: 'เชียงคาน', location: 'Loei', mapUrl: 'https://maps.app.goo.gl/twFWhEurJxfL1cRd6' },
  { img: ne3, name: 'ภูกระดึง', location: 'Loei', mapUrl: 'https://maps.app.goo.gl/rgkohvBcYdiRyzGm9' },
  { img: ne4, name: 'ทุ่งดอกกระเจียว', location: 'Chaiyaphum', mapUrl: '' },
  { img: ne5, name: 'เขาใหญ่', location: 'Nakhon Ratchasima', mapUrl: 'https://maps.app.goo.gl/V6PAWhQkunRonvfT7' },
  { img: ne6, name: 'น้ำตกห้วยหลวง', location: 'Ubon Ratchathani', mapUrl: 'https://maps.app.goo.gl/RPda23feepM9DRsd6' },
  { img: ne7, name: 'สามพันโบก', location: 'Ubon Ratchathani', mapUrl: 'https://maps.app.goo.gl/pTNx2P4zJ4VgyJJeA' },
  { img: ne8, name: 'ทะเลบัวแดง', location: 'Udon Thani', mapUrl: 'https://maps.app.goo.gl/CQTH8kpG8htRSwxw7' },
  { img: ne9, name: 'น้ำตกตาดวิมานทิพย์', location: 'Bueng Kan', mapUrl: 'https://maps.app.goo.gl/3hwZXVuS49iGhzba7' },
]

// SOUTH
const southNatureCards = [
  { img: south1, name: 'เขื่อนเชี่ยวหลาน', location: 'Surat Thani', mapUrl: 'https://maps.app.goo.gl/hPE3Giz5H8V6JQDe8' },
  { img: south2, name: 'อุทยานแห่งชาติเขาสก', location: 'Surat Thani', mapUrl: 'https://maps.app.goo.gl/UHtbLATTA14oqqP38' },
  { img: south3, name: 'ป่าต้นน้ำ บ้านน้ำราด', location: 'Surat Thani', mapUrl: 'https://maps.app.goo.gl/5c3p2URM9C2Em2MP7' },
  { img: south4, name: 'หมู่บ้านคีรีวง', location: 'Nakhon Si Thammarat', mapUrl: 'https://maps.app.goo.gl/JBuVQJPz9yfdhEwaA' },
  { img: south5, name: 'หมู่เกาะสิมิลัน', location: 'Phang Nga', mapUrl: 'https://maps.app.goo.gl/coPoccbvypWe9Grh7' },
  { img: south6, name: 'เกาะหลีเป๊ะ', location: 'Satun', mapUrl: 'https://maps.app.goo.gl/ydDwyApoBNvqbajf9' },
  { img: south7, name: 'เกาะกระดาน', location: 'Trang', mapUrl: 'https://maps.app.goo.gl/yDnmZvYVWsqaA1S76' },
  { img: south8, name: 'หมู่เกาะพีพี', location: 'Krabi', mapUrl: 'https://maps.app.goo.gl/jstz7gGjERyuUB1B9' },
]


function RegionSection({ title, cards }: { title: string; cards: typeof bangkokNatureCards }) {
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
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
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
            <div
              key={idx}
              className="snap-start flex-none overflow-hidden rounded-2xl relative group"
              style={{
                width: 'calc(25% - 12px)',
                minWidth: 180,
                height: 320,
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: '0 2px 16px rgba(80,110,130,0.15)',
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
                      '0 1px 0 rgba(255,255,255,0.55)',   // top highlight
                      '0 -1px 0 rgba(0,0,0,0.25)',        // bottom depth
                      '0 0 12px rgba(180,230,255,0.5)',     // outer glow
                      '1px 1px 2px rgba(0,40,80,0.4)',     // cast shadow
                    ].join(', '),
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  {card.name}
                </p>
                {/* Liquid glass location link */}
                <a
                  href={card.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs transition-colors"
                  style={{
                    color: 'rgba(180,230,255,0.88)',
                    textShadow: '0 1px 0 rgba(255,255,255,0.3), 0 0 8px rgba(120,200,255,0.5)',
                  }}
                >
                  <PinIcon />
                  <span>{card.location}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LifestyleNature() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="w-full relative flex items-center justify-center -mt-18"
        style={{ height: 520, backgroundImage: `url(${slide1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* gradient fade to blue-gray — smooth multi-stop */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(59,59,59,0.05) 50%, rgba(160,186,150,0.55) 80%, #BBC6A8 100%)' }} />
      </section>

      {/* ── bg wrapper: intro + regions share the same bg ── */}
      <div className="bg-[#BBC6A8]">
        {/* ── Intro text ── */}
        <section className="max-w-3xl mx-auto px-10 pt-10 pb-6 text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              color: 'rgba(75,50,30,0.92)',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)',
            }}
          >ตรงใจไลฟ์สไตล์สายรักษ์ธรรมชาติ สายแอดเวนเจอร์</h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'rgba(75,50,30,0.92)',
              textShadow: 'none',
            }}
          >
            เหมาะสำหรับผู้ที่รักการผจญภัยและชื่นชอบการท่องเที่ยวท่ามกลางธรรมชาติ ไม่ว่าจะเป็นการเดินป่า กางเต็นท์ ปีนเขา
            อีกทั้งยังเป็นสไตล์การท่องเที่ยวที่ได้รับความนิยมในกลุ่มคนรุ่นใหม่อย่าง Gen Z
            ที่ต้องการออกไปสัมผัสประสบการณ์ใหม่ ๆ พร้อมเก็บภาพความประทับใจจากการผจญภัยในธรรมชาติ🏕️📸
          </p>
        </section>

        <RegionSection title="Bankok & Central region" cards={bangkokNatureCards} />
        <RegionSection title="North" cards={northNatureCards} />
        <RegionSection title="NorthEast" cards={northeastNatureCards} />
        <RegionSection title="South" cards={southNatureCards} />

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
              boxShadow: '0 4px 24px rgba(60,90,60,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: 'rgba(75,50,30,0.92)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              textShadow: '0 1px 0 rgba(255,255,255,0.7), 0 0 12px rgba(100,160,100,0.4)',
              transition: 'box-shadow 0.25s, background 0.25s, transform 0.2s',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.20)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(60,90,60,0.28), inset 0 1px 0 rgba(255,255,255,0.6)'
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(60,90,60,0.18), inset 0 1px 0 rgba(255,255,255,0.5)'
            }}
          >
            ลองจัดทริปในสไตล์ของคุณดูสิ !
          </Link>
        </div>
      </div >
    </>
  )
}
