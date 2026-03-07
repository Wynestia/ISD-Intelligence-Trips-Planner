import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import slide1 from '../assets/life-cafe/cover.jpg'

// north
import north1 from '../assets/life-cafe/north1.jpg'
import north2 from '../assets/life-cafe/north2.jpg'
import north3 from '../assets/life-cafe/north3.jpg'
import north4 from '../assets/life-cafe/north4.jpeg'
import north5 from '../assets/life-cafe/north5.jpg'

// ne
import ne1 from '../assets/life-cafe/ne1.jpeg'
import ne2 from '../assets/life-cafe/ne2.jpeg'
import ne3 from '../assets/life-cafe/ne3.webp'
import ne4 from '../assets/life-cafe/ne4.jpeg'
import ne5 from '../assets/life-cafe/ne5.jpg'
import ne6 from '../assets/life-cafe/ne6.jpg'

// md
import md1 from '../assets/life-cafe/md1.jpg'
import md2 from '../assets/life-cafe/md2.jpg'
import md3 from '../assets/life-cafe/md3.png'
import md4 from '../assets/life-cafe/md4.jpeg'
import md5 from '../assets/life-cafe/md5.jpg'
import md6 from '../assets/life-cafe/md6.jpg'
import md7 from '../assets/life-cafe/md7.jpg'
import md8 from '../assets/life-cafe/md8.jpg'

// south
import south1 from '../assets/life-cafe/south1.jpeg'
import south2 from '../assets/life-cafe/south2.jpg'
import south3 from '../assets/life-cafe/south3.jpeg'
import south4 from '../assets/life-cafe/south4.jpeg'
import south5 from '../assets/life-cafe/south5.jpg'

export const Route = createFileRoute('/lifestyle-cafe')({ component: LifestyleCafe })

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
const bangkokCards = [
  { img: md1, name: 'Lhong Tou Cafe', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/AuN9XpaKNmKzvQW59' },
  { img: md2, name: 'Cafe Narasingh', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/JtGJHb6Dmq8YyqWJ6' },
  { img: md3, name: 'Sarnies Bangkok', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/9uD6NEDFPQucqfhG7' },
  { img: md4, name: 'Bankampu Tropical Cafe', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/S3z38m6REDZnDdcN8' },
  { img: md5, name: 'Unbirthday Cafe', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/wipyiQDxaSSjYqxv6' },
  { img: md6, name: 'Woodbrook Bangkok', location: 'Bangkok', mapUrl: 'https://maps.app.goo.gl/8ozuXCdZqkggiFyMA' },
  { img: md7, name: 'Sunset Spirit Bangpu', location: 'Samut Prakan', mapUrl: 'https://maps.app.goo.gl/XzMo7KNLPxsSCvw36' },
  { img: md8, name: 'Bubble in the Forest Cafe', location: 'Nakhon Pathom', mapUrl: 'https://maps.app.goo.gl/77hNALrHgRmMv6SPA' },
]

// NORTH
const northCards = [
  { img: north1, name: 'Abonzo Coffee', location: 'Chiang Rai', mapUrl: 'https://maps.app.goo.gl/a8YCDcSCSiB4bd2H8' },
  { img: north2, name: 'TOMATO.cafe.cnx', location: 'Chiang Mai', mapUrl: 'https://maps.app.goo.gl/PcK79ozwTPsn1nLg9' },
  { img: north3, name: "KRISP Cafe'", location: 'Chiang Mai', mapUrl: 'https://maps.app.goo.gl/mFDQht5ebAqLuSe59' },
  { img: north4, name: 'No 39 Cafe', location: 'Chiang Mai', mapUrl: 'https://maps.app.goo.gl/qeu5k5XtQvQXdLjUA' },
  { img: north5, name: 'Low Cal Cafe Chiangrai', location: 'Chiang Rai', mapUrl: 'https://maps.app.goo.gl/wWhVGjyjCzDe3asi8' },
]

// NORTHEAST (ne images)
const northeastCards = [
  { img: ne1, name: 'Red And Brew Coffee', location: 'Nakhon Ratchasima', mapUrl: 'https://maps.app.goo.gl/w4Nx6Pe1kqmQajs56' },
  { img: ne2, name: 'Barn Naa Cafe', location: 'Udon Thani', mapUrl: 'https://maps.app.goo.gl/w9hasXmqhDFADFoy5' },
  { img: ne3, name: '11AM Cafe and Space', location: 'Khon Kaen', mapUrl: 'https://maps.app.goo.gl/6V4vL4ktNzHQ5N4u9' },
  { img: ne4, name: '249 Baan Nuntakit', location: 'Khon Kaen', mapUrl: 'https://maps.app.goo.gl/1jMYon4N6g3rB5Ds5' },
  { img: ne5, name: 'Within Khaoyai', location: 'Nakhon Ratchasima', mapUrl: 'https://maps.app.goo.gl/gaYayqU5RgNNx82D9' },
  { img: ne6, name: 'Trot Cafe Khaoyai', location: 'Nakhon Ratchasima', mapUrl: 'https://maps.app.goo.gl/ETECeHwMmF91HDJd6' },
]

// SOUTH (ถ้ายังไม่มีใน pdf ก็ใช้ของเดิม)
const southCards = [
  { img: south1, name: 'Andaman Treehouse', location: 'Krabi', mapUrl: 'https://maps.google.com/?q=Cafe+Krabi' },
  { img: south2, name: 'Baan Krating', location: 'Phuket', mapUrl: 'https://maps.google.com/?q=Cafe+Phuket' },
  { img: south3, name: 'KohSam Coffee', location: 'Koh Samui', mapUrl: 'https://maps.google.com/?q=Cafe+Koh+Samui' },
  { img: south4, name: 'Seaside Sip', location: 'Hua Hin', mapUrl: 'https://maps.google.com/?q=Cafe+Hua+Hin' },
  { img: south5, name: 'Trang Twilight', location: 'Trang', mapUrl: 'https://maps.google.com/?q=Cafe+Trang' },
]

function RegionSection({ title, cards }: { title: string; cards: typeof bangkokCards }) {
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
            color: 'rgba(60,80,100,0.9)',
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

function LifestyleCafe() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="w-full relative flex items-center justify-center -mt-18"
        style={{ height: 520, backgroundImage: `url(${slide1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* gradient fade to blue-gray — smooth multi-stop */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(59,59,59,0.05) 50%, rgba(174,196,208,0.55) 80%, #D2DFE5 100%)' }} />
      </section>

      {/* ── bg wrapper: intro + regions share the same bg ── */}
      <div className="bg-[#D2DFE5]">
        {/* ── Intro text ── */}
        <section className="max-w-3xl mx-auto px-10 pt-10 pb-6 text-center">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              color: 'rgba(50,75,95,0.92)',
              textShadow: '0 1px 2px rgba(0,0,0,0.12)',
            }}
          >ตรงใจไลฟ์สไตล์สายคาเฟ่</h2>
          <p
            className="text-sm leading-relaxed"
            style={{
              color: 'rgba(60,90,110,0.85)',
              textShadow: 'none',
            }}
          >
            เอาใจสายคาเฟ่ฮอปปิงที่ชื่นชอบการนั่งชิล ถ่ายรูป และค้นหาร้านสวย ๆ ที่มีเอกลักษณ์ <br />
            ไม่ว่าจะเป็นคาเฟ่บรรยากาศธรรมชาติ คาเฟ่มินิมอล หรือร้านดีไซน์เก๋ ๆ <br />
            เหมาะสำหรับการเดินทางกับคู่รักหรือกลุ่มเพื่อน โดยเฉพาะกลุ่ม Gen Z <br />
            ที่รักการแชร์โมเมนต์ผ่านภาพถ่ายและโซเชียลมีเดีย 📸☕✨
          </p>
        </section>

        <RegionSection title="Bankok & Central region" cards={bangkokCards} />
        <RegionSection title="North" cards={northCards} />
        <RegionSection title="NorthEast" cards={northeastCards} />
        <RegionSection title="South" cards={southCards} />

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
              boxShadow: '0 4px 24px rgba(80,110,130,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: 'rgba(50,75,95,0.92)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              textShadow: '0 1px 0 rgba(255,255,255,0.7), 0 0 12px rgba(140,200,230,0.4)',
              transition: 'box-shadow 0.25s, background 0.25s, transform 0.2s',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.20)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(80,110,130,0.28), inset 0 1px 0 rgba(255,255,255,0.6)'
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)'
                ; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(80,110,130,0.18), inset 0 1px 0 rgba(255,255,255,0.5)'
            }}
          >
            ลองจัดทริปในสไตล์ของคุณดูสิ !
          </Link>
        </div>
      </div >

    </>
  )
}
