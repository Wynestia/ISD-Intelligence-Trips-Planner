import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Footer from '../components/Footer'

import slide1 from '../assets/slideshow/1.jpg'

import north1 from '../assets/grid/north1.jpg'
import north2 from '../assets/grid/north2.jpg'
import north3 from '../assets/grid/north3.jpg'
import north4 from '../assets/grid/north4.jpg'
import north5 from '../assets/grid/north5.webp'

import se1 from '../assets/grid/se1.jpeg'
import se2 from '../assets/grid/se2.jpg'
import se3 from '../assets/grid/se3.png'
import se4 from '../assets/grid/se4.jpg'

import east1 from '../assets/grid/east1.jpg'
import east2 from '../assets/grid/east2.png'
import east3 from '../assets/grid/east3.jpg'
import east4 from '../assets/grid/east4.jpg'

import south1 from '../assets/grid/south1.jpg'
import south2 from '../assets/grid/south2.webp'
import south3 from '../assets/grid/south3.jpg'
import south4 from '../assets/grid/south4.png'

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
const bangkokCards = [
  { img: se1, name: 'คาเฟ่บ้านป้า', location: 'Bangkok', mapUrl: 'https://maps.google.com/?q=คาเฟ่+กรุงเทพ' },
  { img: se2, name: 'The Gallery Cafe', location: 'Bangkok', mapUrl: 'https://maps.google.com/?q=The+Gallery+Cafe+Bangkok' },
  { img: se3, name: 'Rooftop Brews', location: 'Bangkok', mapUrl: 'https://maps.google.com/?q=Rooftop+Cafe+Bangkok' },
  { img: se4, name: 'Hidden Garden', location: 'Bangkok', mapUrl: 'https://maps.google.com/?q=Hidden+Garden+Cafe+Bangkok' },
  { img: east1, name: 'Brick Lane Cafe', location: 'Nonthaburi', mapUrl: 'https://maps.google.com/?q=Cafe+Nonthaburi' },
]

const northCards = [
  { img: north1, name: 'Doi Tung Coffee', location: 'Chiang Rai', mapUrl: 'https://maps.google.com/?q=Doi+Tung+Coffee+Chiang+Rai' },
  { img: north2, name: 'Akha Ama Coffee', location: 'Chiang Mai', mapUrl: 'https://maps.google.com/?q=Akha+Ama+Coffee+Chiang+Mai' },
  { img: north3, name: 'Ristr8to Lab', location: 'Chiang Mai', mapUrl: 'https://maps.google.com/?q=Ristr8to+Chiang+Mai' },
  { img: north4, name: 'The Barn Eatery', location: 'Chiang Rai', mapUrl: 'https://maps.google.com/?q=The+Barn+Eatery+Chiang+Rai' },
  { img: north5, name: 'Phu Chi Fah View', location: 'Chiang Rai', mapUrl: 'https://maps.google.com/?q=Phu+Chi+Fah+Chiang+Rai' },
]

const northeastCards = [
  { img: east2, name: 'Isaan Brew House', location: 'Khon Kaen', mapUrl: 'https://maps.google.com/?q=Cafe+Khon+Kaen' },
  { img: east3, name: 'Mekong View', location: 'Nong Khai', mapUrl: 'https://maps.google.com/?q=Cafe+Nong+Khai' },
  { img: east4, name: 'Phu Pan Forest', location: 'Sakon Nakhon', mapUrl: 'https://maps.google.com/?q=Cafe+Sakon+Nakhon' },
  { img: north1, name: 'Phonsawan Cafe', location: 'Udon Thani', mapUrl: 'https://maps.google.com/?q=Cafe+Udon+Thani' },
  { img: se3, name: 'Korat Corner', location: 'Nakhon Ratchasima', mapUrl: 'https://maps.google.com/?q=Cafe+Nakhon+Ratchasima' },
]

const southCards = [
  { img: south1, name: 'Andaman Treehouse', location: 'Krabi', mapUrl: 'https://maps.google.com/?q=Cafe+Krabi' },
  { img: south2, name: 'Baan Krating', location: 'Phuket', mapUrl: 'https://maps.google.com/?q=Cafe+Phuket' },
  { img: south3, name: 'KohSam Coffee', location: 'Koh Samui', mapUrl: 'https://maps.google.com/?q=Cafe+Koh+Samui' },
  { img: south4, name: 'Seaside Sip', location: 'Hua Hin', mapUrl: 'https://maps.google.com/?q=Cafe+Hua+Hin' },
  { img: east1, name: 'Trang Twilight', location: 'Trang', mapUrl: 'https://maps.google.com/?q=Cafe+Trang' },
]

function RegionSection({ title, cards }: { title: string; cards: typeof bangkokCards }) {
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)

  const scrollLeft = () => scrollRef?.scrollBy({ left: -(scrollRef.offsetWidth * 0.8), behavior: 'smooth' })
  const scrollRight = () => scrollRef?.scrollBy({ left: scrollRef.offsetWidth * 0.8, behavior: 'smooth' })

  return (
    <section className="py-10">
      {/* Section header */}
      <div className="max-w-6xl mx-auto px-10 flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-[#4A4444]">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg pb-0.5"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="w-9 h-9 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg pb-0.5"
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
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow snap-start flex-none overflow-hidden"
              style={{ width: 'calc(25% - 12px)', minWidth: 180 }}
            >
              {/* Card image */}
              <div className="w-full overflow-hidden" style={{ height: 300 }}>
                <img
                  src={card.img}
                  alt={card.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card info */}
              <div className="p-3 pt-2">
                <p className="text-[#984216] font-semibold text-sm leading-snug mb-1">{card.name}</p>
                <a
                  href={card.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#7DA2B6] text-xs hover:text-[#5a8a9f] transition-colors"
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

function LifestyleCafe() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="w-full relative flex items-center justify-center -mt-18"
        style={{ height: 520, backgroundImage: `url(${slide1})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* gradient fade to white — smooth multi-stop */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(59, 59, 59, 0.05) 50%, rgba(194, 194, 194, 0.4) 75%, rgba(255, 255, 255, 0.85) 90%, white 100%)' }} />
        <div className="relative z-10 text-center">
          <h1 className="text-white text-4xl font-bold tracking-wide drop-shadow">ใจอัมเดิม</h1>
        </div>
      </section>

      {/* ── Intro text ── */}
      <section className="max-w-3xl mx-auto px-10 py-10 text-center">
        <h2 className="text-lg font-bold text-[#4A4444] mb-2">ตรงใจไลฟ์สไตล์สายคาเฟ่</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          สายยอดฮิตของกลุ่ม Gen Z เดินทางเป็นกลุ่มคู่รัก กลุ่มเพื่อน<br />
          เป็นสายชอบถ่ายรูป ปัจจุบันมีหลายๆคาเฟ่ที่กลุ่มนี้หรือที่น่าจะทำงาน
        </p>
      </section>

      {/* ── bg wrapper for regions ── */}
      <div className="bg-[#D2DFE5]">
        <RegionSection title="Bankok & Central region" cards={bangkokCards} />
        <RegionSection title="North" cards={northCards} />
        <RegionSection title="NorthEast" cards={northeastCards} />
        <RegionSection title="South" cards={southCards} />
      </div>

      <Footer />
    </>
  )
}
