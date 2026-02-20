import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

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
          <h1 className="text-2xl font-bold mb-3">Intelligence Trip Planner</h1>
          <p className="text-sm text-gray-700 mb-6">
            รายละเอียด เอาไว้ทำอะไรบ้าง <br />
            รายชื่อสมาชิก
          </p>

          <Link to={'/about'} className="nav-link"><button className="btn-primary">
            ทริปตรงใจคุณ
          </button></Link>

        </div>

        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="stat-title">40+</p>
            <p className="stat-desc">จังหวัดแนะนำ</p>
          </div>
          <div>
            <p className="stat-title">10+</p>
            <p className="stat-desc">สถานที่แนะนำ</p>
          </div>
          <div>
            <p className="stat-title">10+</p>
            <p className="stat-desc">ที่พักแนะนำ</p>
          </div>
          <div>
            <p className="stat-title">10+</p>
            <p className="stat-desc">ที่พักแนะนำ</p>
          </div>
        </div>

      </section>

      <section className="py-12 bg-[rgba(131,153,88,0.3)]">
        <div className="max-w-6xl mx-auto px-10">
          <h2 className="text-xl font-bold mb-2">ทริปที่มีคนสนใจสูงสุด</h2>
          <p className="text-sm text-gray-700 mb-6">
            รายละเอียด เอาไว้ทำอะไรบ้าง <br />
            รายชื่อสมาชิก
          </p>

          <div className="flex items-center space-x-4">
            <button className="arrow-btn">‹</button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
              <div className="trip-card">เที่ยวธรรมชาติ<br />3 วัน 2 คืน</div>
              <div className="trip-card">เที่ยวหน้าฝน<br />3 วัน 2 คืน</div>
              <div className="trip-card">สายคาเฟ่<br />2 วัน 1 คืน</div>
            </div>

            <button className="arrow-btn">›</button>
          </div>
        </div>
      </section>
    </>
  )
}
