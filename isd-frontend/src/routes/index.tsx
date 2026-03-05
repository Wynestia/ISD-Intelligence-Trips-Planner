import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer'

import slide1 from '../assets/slideshow/1.jpg'
import slide2 from '../assets/slideshow/2.jpg'
import slide3 from '../assets/slideshow/3.jpg'
import slide4 from '../assets/slideshow/4.jpg'
import slide5 from '../assets/slideshow/5.jpg'
import slide6 from '../assets/slideshow/6.jpg'

// import {
//   Zap,
//   Server,
//   Route as RouteIcon,
//   Shield,
//   Waves,
//   Sparkles,
// } from 'lucide-react'



export const Route = createFileRoute('/')({ component: App })

function App() {

  const slides: string[] = [slide1, slide2, slide3, slide4, slide5, slide6]
  const [current, setCurrent] = useState<number>(0)

  // Auto Slide
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


      {/* <section className="h-75 pt-10 flex items-center justify-center">
        <div className="px-10 w-full h-75 flex items-center justify-center overflow-hidden">
          <img src="https://img.kapook.com/u/2023/sutasinee/12/p4.jpg" alt="phuchifah"
            className="w-full h-80 object-cover" />
        </div>
      </section> */}
      {/* 🔥 Slideshow Section — flush to navbar */}
      <section className="-mt-14 relative w-full h-[600px]">
        <div className="group relative w-full h-full overflow-hidden">

          {/* Images Layer (crossfade) */}
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

          {/* ปุ่มซ้าย — แสดงเมื่อ hover */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/70 px-4 py-2 rounded-full text-xl hover:bg-white transition
              opacity-0 group-hover:opacity-100 duration-300"
          >
            ‹
          </button>

          {/* ปุ่มขวา — แสดงเมื่อ hover */}
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/70 px-4 py-2 rounded-full text-xl hover:bg-white transition
              opacity-0 group-hover:opacity-100 duration-300"
          >
            ›
          </button>

          {/* 🔵 Dot Indicator — แสดงเมื่อ hover */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-3
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300
                  ${index === current
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white'}
                `}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-10 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

        <div>
          <h1 className="text-2xl text-[#4A4444] font-bold mb-3">TRAVELTHAI: Intelligence Trip Planner</h1>
          <p className="text-sm text-(--stormy-sky) font-semibold mb-6">
            ยินดีต้อนรับสู่ระบบวางแผนการเดินทางอัจฉริยะ <br />
            ค้นพบประสบการณ์ท่องเที่ยวที่ไม่เหมือนใครด้วย TRAVELTHAI <br />
            ค้นหาที่เที่ยวโดนใจ สไตล์ gen Z
          </p>

          <Link to={'/about'} className="nav-link">
            <button className="bg-[#A9C5CF] text-[#4A4444] px-8 py-2 rounded-full font-semibold hover:bg-[#98b4be] hover:border-solid hover:border-2 hover:border-[#4A4444]">
              ค้นหาทริปโดนใจ
            </button>
          </Link>

        </div>

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

      </section>

      {/* ทริปที่มีคนสนใจสูงสุด */}

      <section className="py-12 bg-[#E4D6C5]">
        <div className="max-w-6xl mx-auto px-10 flex flex-col md:flex-row gap-8 items-center md:items-start" style={{ minHeight: '400px' }}>

          <div className="md:w-1/3 flex flex-col justify-center h-full pt-4 md:pt-14">
            <h2 className="text-3xl font-bold mb-2 text-[#984216]">รวมทริปที่คนสนใจสูงสุด</h2>
            <p className="text-[#984216] text-lg mb-8">รวมทริปที่โดนใจเจน Z ที่สุดตามฤดูกาล</p>

            <div className="flex items-center space-x-3">
              <button
                className="w-10 h-10 rounded-full border border-gray-400 text-gray-500 flex items-center justify-center hover:bg-white transition-colors pb-1"
                onClick={() => {
                  const container = document.getElementById('trip-scroll-container');
                  if (container) {
                    container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
                  }
                }}
              >
                <span className="text-2xl">‹</span>
              </button>

              <button
                className="w-10 h-10 rounded-full bg-[#8D957E] text-white hover:bg-[#7a826c] flex items-center justify-center transition-colors pb-1"
                onClick={() => {
                  const container = document.getElementById('trip-scroll-container');
                  if (container) {
                    container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
                  }
                }}
              >
                <span className="text-2xl">›</span>
              </button>
            </div>
          </div>

          <div className="md:w-2/3 w-full overflow-hidden">
            <div
              id="trip-scroll-container"
              className="flex overflow-x-auto gap-4 py-8 hide-scrollbar snap-x snap-mandatory"
            >
              {[
                "ธรรมชาติใกล้กรุงเทพ\n3 วัน 2 คืน\nrainy season",
                "รับลมหนาวที่เมืองเหนือ\n5 วัน 4 คืน\nwinter season",
                "เที่ยวทะเลรับซัมเมอร์\n3 วัน 2 คืน\nsummer season",
                "เดินป่าพาชมดาว@ภูสอยดาว\n2 วัน 1 คืน\nrainy season",
                "ชมภูเขาสีชมพูสัมผัสทะเลหมอก\n3 วัน 2 คืน\nwinter season",
                "ทริปโรแมนติกที่ประจวบ\n4 วัน 3 คืน\nsummer season"
              ].map((trip, idx) => {
                const parts = trip.split('\n');
                const routes = ['/poptrip1', '/poptrip2', '/poptrip3', '/poptrip4', '/poptrip5', '/poptrip6'];
                const cardStyle = { flex: '0 0 calc(33.333% - 11px)', height: '360px' };
                return (
                  <Link
                    key={idx}
                    to={routes[idx]}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow snap-start flex flex-col justify-end p-6 cursor-pointer"
                    style={cardStyle}
                  >
                    <div className="text-[#984216] font-bold text-lg leading-snug">{parts[0]}</div>
                    <div className="text-[#984216] text-base mb-1">{parts[1]}</div>
                    <div className="text-[#7DA2B6] font-bold text-base">{parts[2]}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Lifestyle Section ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-10 py-16">
        <h2 className="text-2xl font-bold text-center text-[#4A4444] mb-10">รวมที่เที่ยวตรงไลฟ์สไตล์</h2>

        <div className="flex flex-col gap-10">

          {/* Row 1: image left, text right */}
          <div className="flex flex-row gap-6 items-center">
            <div className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={slide1} alt="lifestyle 1" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
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
            </div>
          </div>

          {/* Row 2: text left, image right */}
          <div className="flex flex-row gap-6 items-center">
            <div className="flex-1 flex flex-col gap-3 text-end">
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
            </div>
            <div className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={slide3} alt="lifestyle 2" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Row 3: image left, text right */}
          <div className="flex flex-row gap-6 items-center">
            <div className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={slide4} alt="lifestyle 3" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col gap-3">
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
            </div>
          </div>

          {/* Row 4: text left, image right */}
          <div className="flex flex-row gap-6 items-center">
            <div className="flex-1 flex flex-col gap-3 text-end">
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
            </div>
            <div className="w-1/2 h-72 bg-gray-200 rounded-xl overflow-hidden flex-none">
              <img src={slide6} alt="lifestyle 4" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* ── Photo Grid ──────────────────────────────────────────────────── */}
      <div className="bg-[#D2DFE5]">
        <section className="max-w-6xl mx-auto px-10 py-12">
          <h2 className="text-xl font-bold mb-2">THAITRAVEL GALLERY</h2>
          <p className="text-sm text-gray-600 mb-6">Find your destination</p>

          <div className="grid grid-cols-4 gap-1.5">

            {/* Row 1: sm | BIG | sm */}
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/north2.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/north1.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/north4.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>

            {/* Row 2: BIG | sm | sm */}
            <div className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/se3.png" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/se1.jpeg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/se4.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>

            {/* Row 3: sm | sm | BIG */}
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/east1.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/east4.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/east2.png" alt="gallery" className="w-full h-full object-cover" />
            </div>

            {/* Row 4: BIG | sm | sm */}
            <div className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/south1.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/south2.webp" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/south3.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>

            {/* Row 5: sm | sm | BIG */}
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/west1.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/west2.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/west3.webp" alt="gallery" className="w-full h-full object-cover" />
            </div>

            {/* Row 6: sm | BIG | sm */}
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/me4.jpg" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/me3.avif" alt="gallery" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 overflow-hidden rounded transition-opacity duration-300 hover:opacity-80">
              <img src="src/assets/grid/me2.jpeg" alt="gallery" className="w-full h-full object-cover" />
            </div>

          </div>
        </section>
      </div>

      <Footer />

    </>
  )
}
