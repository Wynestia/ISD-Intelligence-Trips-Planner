import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import Footer from '../components/Footer'

import slide1 from '../assets/slideshow/1.jpg'
import slide2 from '../assets/slideshow/2.jpg'
import slide3 from '../assets/slideshow/3.jpg'
import slide4 from '../assets/slideshow/4.jpg'
import slide5 from '../assets/slideshow/5.jpg'
import slide6 from '../assets/slideshow/6.jpg'

import tripCover1 from '../assets/poptrip/trip1-pop.webp'
import tripCover2 from '../assets/poptrip/trip2-pop.jpg'
import tripCover3 from '../assets/poptrip/trip3-.webp'
import tripCover4 from '../assets/poptrip/trip4-pop.jpg'
import tripCover5 from '../assets/poptrip/trip5-pop1.jpg'
import tripCover6 from '../assets/poptrip/trip6-pop.jpg'

import lifestyle1 from '../assets/life-cafe/cover.jpg'
import lifestyle2 from '../assets/life-nature/cover.png'
import lifestyle3 from '../assets/life-tem/cover.jpg'
import lifestyle4 from '../assets/life-festive/cover.jpg'

import imageMid from '../assets/poptrip/trip3-pop.jpg'


export const Route = createFileRoute('/')({ component: App })

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
    }, { threshold: 0.10, ...options })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

// ── Reveal Component ────────────────────────────────────────────────────
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
}) {
  const { ref, visible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 1.1s ease ${delay}ms, transform 1.1s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate(0,0)' : `translate(${tx}px,${ty}px)`,
      }}
    >
      {children}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────────────────
function App() {
  const slides: string[] = [slide1, slide2, slide3, slide4, slide5, slide6]
  const [current, setCurrent] = useState<number>(0)

  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = (): void => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = (): void => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <>
      {/* 🔥 Slideshow Section */}
      <section className="-mt-14 relative w-full h-[600px]">
        <div className="group relative w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide}
              alt={`slide-${index}`}
              className={`absolute w-full h-full object-cover transition-opacity duration-1000 ease-in-out
                ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}
              `}
            />
          ))}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/70 px-4 py-2 rounded-full text-xl hover:bg-white transition
              opacity-0 group-hover:opacity-100 duration-300"
          >‹</button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/70 px-4 py-2 rounded-full text-xl hover:bg-white transition
              opacity-0 group-hover:opacity-100 duration-300"
          >›</button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-3
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300
                  ${index === current ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro + Stats ── */}
      <section className="max-w-6xl mx-auto px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <Reveal tx={-40} ty={0}>
          <div>
            <h1 className="text-2xl text-[#4A4444] font-bold mb-3">TRAVELTHAI: Intelligence Trip Planner</h1>
            <p className="text-sm text-(--stormy-sky) font-semibold mb-6">
              ยินดีต้อนรับสู่ระบบวางแผนการเดินทางอัจฉริยะ <br />
              ค้นพบประสบการณ์ท่องเที่ยวที่ไม่เหมือนใครด้วย TRAVELTHAI <br />
              ค้นหาที่เที่ยวโดนใจ สไตล์ gen Z
            </p>
            <Link to={'/about'} className="nav-link">
              <button className="bg-[#8D957E] text-white px-8 py-2 rounded-full font-semibold hover:bg-[#7a826c] transition-colors hover:border-2">
                ออกแบบทริปตรงใจคุณ
              </button>
            </Link>
          </div>
        </Reveal>

        <Reveal tx={40} ty={0} delay={150}>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className='border border-sky-100 bg-sky-50 rounded-lg py-6 shadow-[0_0_20px_-3px_rgba(100,116,139,0.3)] hover:shadow-[0_0_25px_0px_rgba(100,116,139,0.5)] transition-shadow duration-300'>
              <p className="stat-title text-xl font-bold">10m+</p>
              <p className="stat-desc text-sm">ผู้ใช้งาน</p>
            </div>
            <div className='border border-sky-100 bg-sky-50 rounded-lg py-6 shadow-[0_0_20px_-3px_rgba(100,116,139,0.3)] hover:shadow-[0_0_25px_0px_rgba(100,116,139,0.5)] transition-shadow duration-300'>
              <p className="stat-title text-xl font-bold">50+</p>
              <p className="stat-desc text-sm">จังหวัดแนะนำ</p>
            </div>
            <div className='border border-sky-100 bg-sky-50 rounded-lg py-6 shadow-[0_0_20px_-3px_rgba(100,116,139,0.3)] hover:shadow-[0_0_25px_0px_rgba(100,116,139,0.5)] transition-shadow duration-300'>
              <p className="stat-title text-xl font-bold">50+</p>
              <p className="stat-desc text-sm">สถานที่แนะนำ</p>
            </div>
            <div className='border border-sky-100 bg-sky-50 rounded-lg py-6 shadow-[0_0_20px_-3px_rgba(100,116,139,0.3)] hover:shadow-[0_0_25px_0px_rgba(100,116,139,0.5)] transition-shadow duration-300'>
              <p className="stat-title text-xl font-bold">10+</p>
              <p className="stat-desc text-sm">ร้านแนะนำ</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* story element */}
      <div className="relative w-full h-[1000px] md:h-[1200px] overflow-hidden">

        {/* Background */}
        <section
          className="absolute inset-0 -mt-20"
          style={{
            height: 1400,
            backgroundImage: `url(${imageMid})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Top & Bottom Gradients */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-64 -mt-16 z-[5]"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, #f0ece8 0%, rgba(240,236,232,0.92) 25%, rgba(240,236,232,0.55) 55%, rgba(240,236,232,0.15) 78%, rgba(240,236,232,0) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 z-[5]"
          style={{
            backgroundImage:
              'linear-gradient(to top, #E4D6C5 0%, rgba(228,214,197,0.98) 20%, rgba(228,214,197,0.6) 45%, rgba(228,214,197,0) 100%)',
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 z-10 flex items-center px-8 sm:px-16">
          <Reveal ty={30} delay={80} className="duration-300">
            <div
              className="max-w-md p-8 rounded-2xl text-white"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <h1 className="text-2xl font-bold mb-1">TRAVELTHAI</h1>

              <p className="text-(--burnt-sienna)/90 text-sm font-semibold tracking-widest uppercase mb-4">
                Best assistant to find your trip
              </p>

              <p className="text-sm leading-relaxed text-white/90">
                ผู้ช่วยที่จะทำให้การวางแผนท่องเที่ยวของคุณเป็นเรื่องง่ายและสนุกยิ่งขึ้น
                มาร่วมออกแบบทริปการท่องเที่ยวทั่วไทยไปกับ TRAVELTHAI
                เว็บไซต์ที่รวบรวมแหล่งท่องเที่ยวหลากหลายสไตล์
                ไม่ว่าจะเป็นสถานที่ท่องเที่ยวยอดฮิตหรือแหล่งท่องเที่ยว Unseen
                ที่รอให้คุณไปค้นพบ นอกจากนี้ยังมีตัวช่วยอย่าง{" "}
                <span className="text-(--burnt-sienna)/90 font-semibold">
                  "น้องพาเที่ยว"
                </span>{" "}
                ผู้ช่วยอัจฉริยะที่จะช่วยออกแบบทริปให้เหมาะกับไลฟ์สไตล์ของคุณ ✨
              </p>
            </div>
          </Reveal>
        </div>

      </div>
      {/* ── Popular Trips ── */}
      <section className="py-12 bg-[#E4D6C5]">
        <div className="max-w-6xl mx-auto px-10 flex flex-col md:flex-row gap-8 items-center md:items-start" style={{ minHeight: '400px' }}>

          <Reveal tx={-40} ty={0} className="md:w-1/3 flex flex-col justify-center h-full pt-4 md:pt-14">
            <h2 className="text-3xl font-bold mb-2 text-[#984216]">รวมทริปที่น่าสนใจสำหรับเจน Z</h2>
            <p className="text-[#984216] text-lg mb-8">รวมทริปที่โดนใจเจน Z ที่สุดตามฤดูกาล</p>
            <div className="flex items-center space-x-3">
              <button
                className="w-10 h-10 rounded-full border border-gray-400 text-gray-500 flex items-center justify-center hover:bg-white transition-colors pb-1"
                onClick={() => {
                  const container = document.getElementById('trip-scroll-container')
                  if (container) container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' })
                }}
              ><span className="text-2xl">‹</span></button>
              <button
                className="w-10 h-10 rounded-full bg-[#8D957E] text-white hover:bg-[#7a826c] flex items-center justify-center transition-colors pb-1"
                onClick={() => {
                  const container = document.getElementById('trip-scroll-container')
                  if (container) container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' })
                }}
              ><span className="text-2xl">›</span></button>
            </div>
          </Reveal>

          <Reveal tx={40} ty={0} delay={200} className="md:w-2/3 w-full overflow-hidden">
            <div
              id="trip-scroll-container"
              className="flex overflow-x-auto gap-4 py-8 hide-scrollbar snap-x snap-mandatory"
            >
              {[
                { title: "ธรรมชาติใกล้กรุงเทพ", sub: "3 วัน 2 คืน", tag: "rainy season", img: tripCover1, route: '/poptrip1' },
                { title: "รับลมหนาวที่เมืองเหนือ", sub: "5 วัน 4 คืน", tag: "winter season", img: tripCover2, route: '/poptrip2' },
                { title: "เที่ยวทะเลรับซัมเมอร์", sub: "3 วัน 2 คืน", tag: "summer season", img: tripCover3, route: '/poptrip3' },
                { title: "เดินป่าพาชมดาว@ภูสอยดาว", sub: "2 วัน 1 คืน", tag: "rainy season", img: tripCover4, route: '/poptrip4' },
                { title: "ชมภูเขาสีชมพูสัมผัสทะเลหมอก", sub: "3 วัน 2 คืน", tag: "winter season", img: tripCover5, route: '/poptrip5' },
                { title: "ทริปโรแมนติกที่ทะเลตะวันอก", sub: "3 วัน 3 คืน", tag: "summer season", img: tripCover6, route: '/poptrip6' },
              ].map((trip, idx) => (
                <Link
                  key={idx}
                  to={trip.route}
                  className="relative rounded-2xl overflow-hidden snap-start flex flex-col justify-end cursor-pointer"
                  style={{
                    flex: '0 0 calc(33.333% - 11px)',
                    height: '360px',
                    backgroundImage: `url(${trip.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {/* dark gradient overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 40%, transparent 100%)' }} />
                  <div className="relative z-10 p-6">
                    <div className="text-white font-bold text-lg leading-snug drop-shadow">{trip.title}</div>
                    <div className="text-white/80 text-base mb-1">{trip.sub}</div>
                    <div className="text-[#A9C5CF] font-bold text-sm">{trip.tag}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Lifestyle Section ── */}
      <section className="max-w-6xl mx-auto px-10 py-16">
        <Reveal>
          <h2 className="text-2xl font-bold text-center text-[#4A4444] mb-10">รวมที่เที่ยวตรงไลฟ์สไตล์</h2>
        </Reveal>

        <div className="flex flex-col gap-10">

          {/* Row 1: image left, text right */}
          <div className="flex flex-row gap-6 items-center">
            <Reveal tx={-50} ty={0} className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={lifestyle1} alt="lifestyle 1" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal tx={50} ty={0} delay={150} className="flex-1 flex flex-col gap-3">
              <h3 className="text-xl font-bold text-[#4A4444]">ตรงใจไลฟ์สไตล์สายคาเฟ่</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                สายยอดฮิตของกลุ่ม Gen Z เดินทางเป็นกลุ่มคู่รัก กลุ่มเพื่อน
                เป็นสายชอบถ่ายรูป ปัจจุบรูปนี้หลายๆคาเฟ่ที่กลุ่มนี้หรือที่น่าจะทำงาน
              </p>
              <Link to="/lifestyle-cafe">
                <button className="self-start bg-[#8D957E] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#7a826c] transition-colors w-fit">
                  คลิกเพื่อเข้าชม
                </button>
              </Link>
            </Reveal>
          </div>

          {/* Row 2: text left, image right */}
          <div className="flex flex-row gap-6 items-center">
            <Reveal tx={-50} ty={0} delay={150} className="flex-1 flex flex-col gap-3 text-end">
              <h3 className="text-xl font-bold text-[#4A4444]">ตรงใจไลฟ์สไตล์สายบุญ สายมู</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                สายยอดนิยมของกลุ่ม Gen X และ Baby boomer ชอบเดินทางเป็นกลุ่มครอบครัว กลุ่มเพื่อน
                และชื่นชอบการท่องเที่ยวเชิงวัฒนธรรม ไหว้พระ ทำบุญ เที่ยวชมเมือง
              </p>
              <Link to="/lifestyle-tem">
                <button className="self-center mx-auto bg-[#8D957E] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#7a826c] transition-colors">
                  คลิกเพื่อเข้าชม
                </button>
              </Link>
            </Reveal>
            <Reveal tx={50} ty={0} className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={lifestyle3} alt="lifestyle 2" className="w-full h-full object-cover" />
            </Reveal>
          </div>

          {/* Row 3: image left, text right */}
          <div className="flex flex-row gap-6 items-center">
            <Reveal tx={-50} ty={0} className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={lifestyle2} alt="lifestyle 3" className="w-full h-full object-cover" />
            </Reveal>
            <Reveal tx={50} ty={0} delay={150} className="flex-1 flex flex-col gap-3">
              <h3 className="text-xl font-bold text-[#4A4444]">ตรงใจไลฟ์สไตล์สายรักษ์ธรรมชาติ สายแอดเวนเจอร์</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                สายยอดฮิตของกลุ่ม Gen Z ที่ตั้งใจติดธรรมชาติ และ มีไลฟ์สไตล์ตัวๆ
                ชอบเดินป้า เดินเขา ทำกิจกรรมที่มีความท้าทาย นิยมที่พักในรูปแมบการเต็นท์หรือที่รถบ้าน
                เพื่อให้ได้กิจกรรมในธรรมชาติมากยิ่งขึ้น นิยมท่องเที่ยวในสถานที่ที่มีความสำคัญในพื้นที่ เช่น อุทยาน
                ควบคู่ไปกับการท่องเที่ยวเชิงวัฒนธรรม สนใจกิจกรรมธรรมชาติอย่างต่อเนื่อง
                และฝึกทักษะที่มีความรักษ์ธรรมชาติอย่างต่อเนื่อง
              </p>
              <Link to="/lifestyle-nature">
                <button className="self-start bg-[#8D957E] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#7a826c] transition-colors w-fit">
                  คลิกเพื่อเข้าชม
                </button>
              </Link>
            </Reveal>
          </div>

          {/* Row 4: text left, image right */}
          <div className="flex flex-row gap-6 items-center">
            <Reveal tx={-50} ty={0} delay={150} className="flex-1 flex flex-col gap-3 text-end">
              <h3 className="text-xl font-bold text-[#4A4444]">ตรงใจสายfestive</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                สายfestive ไลฟ์สไตล์ยอดฮิตของเจน Z เน้นการท่องเที่ยวตามฤดูกาลและเทศกาลต่างๆ
                เป็นกลุ่มที่ชอบแต่งตัวตามเทศกาลและถ่ายรูป
              </p>
              <Link to="/lifestyle-festive">
                <button className="self-center mx-auto bg-[#8D957E] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#7a826c] transition-colors">
                  คลิกเพื่อเข้าชม
                </button>
              </Link>
            </Reveal>
            <Reveal tx={50} ty={0} className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={lifestyle4} alt="lifestyle 4" className="w-full h-full object-cover" />
            </Reveal>
          </div>

        </div>
      </section>

      {/* ── Photo Grid ── */}
      <div className="bg-[#D2DFE5]">
        <section className="max-w-6xl mx-auto px-10 py-12">
          <Reveal>
            <h2 className="text-xl font-bold mb-2">THAITRAVEL GALLERY</h2>
            <p className="text-sm text-gray-600 mb-6">Find your destination</p>
          </Reveal>

          <div className="grid grid-cols-4 gap-1.5">
            {/* Row 1 */}
            <Reveal ty={30} delay={0} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/north2.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={80} className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/north1.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={160} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/north4.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            {/* Row 2 */}
            <Reveal ty={30} delay={0} className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/se3.png" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={80} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/se1.jpeg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={160} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/se4.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            {/* Row 3 */}
            <Reveal ty={30} delay={0} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/east1.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={80} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/east4.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={160} className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/east2.png" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            {/* Row 4 */}
            <Reveal ty={30} delay={0} className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/south1.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={80} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/south2.webp" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={160} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/south3.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            {/* Row 5 */}
            <Reveal ty={30} delay={0} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/west1.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={80} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/west2.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={160} className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/west3.webp" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            {/* Row 6 */}
            <Reveal ty={30} delay={0} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/me4.jpg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={80} className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/me3.avif" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
            <Reveal ty={30} delay={160} className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80"><img src="src/assets/grid/me2.jpeg" alt="gallery" className="w-full h-full object-cover hover:opacity-80" /></Reveal>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
