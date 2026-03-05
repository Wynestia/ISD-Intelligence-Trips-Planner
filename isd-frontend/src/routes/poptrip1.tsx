import { createFileRoute } from '@tanstack/react-router'
import trip1Hero from '../assets/poptrip/trip1-0.webp'
import trip1a from '../assets/poptrip/trip1-1.jpg'
import trip1b from '../assets/poptrip/trip1-2.jpg'
import trip1c from '../assets/poptrip/trip1-3.jpeg'
import trip1d from '../assets/poptrip/trip1-4.jpg'
import trip1e from '../assets/poptrip/trip1-5.jpg'
import trip1f from '../assets/poptrip/trip1-6.jpg'
import trip1g from '../assets/poptrip/trip1-7.jpg'
import trip1h from '../assets/poptrip/trip1-8.jpg'

export const Route = createFileRoute('/poptrip1')({ component: PopTrip1 })

function PopTrip1() {
    return (
        <div className="relative min-h-screen bg-white">

            {/* ── Hero ── */}
            <section
                className="w-full relative flex items-end justify-center -mt-20"
                style={{ height: 650, backgroundImage: `url(${trip1Hero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                {/* gradient fade to white at bottom */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, white 100%)' }} />
                <h1
                    className="relative z-10 text-gray-800 text-4xl font-bold tracking-wide pb-8"
                    style={{ textShadow: '0 1px 3px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.6)' }}
                >เที่ยวธรรมชาติฟีล ๆ</h1>
            </section>

            {/* ── Day Sections ── */}
            <div className="max-w-6xl mx-auto px-12 py-16 flex flex-col gap-28">

                {/* ── DAY 01: timeline left, images right ── */}
                <div>
                    {/* Day header */}
                    <div className="flex flex-col items-start">
                        <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>01</span>
                        <div className="flex items-center gap-2" style={{ marginTop: -6 }}>
                            <div className="h-px w-12 bg-[#7DA2B6]" />
                            <span className="text-sm text-[#7DA2B6] font-medium">Start day1</span>
                        </div>
                    </div>

                    <div className="flex gap-8 mt-6">
                        {/* Timeline */}
                        <div className="flex gap-5 shrink-0" style={{ width: '45%' }}>
                            {/* Dots */}
                            <div className="flex flex-col items-center pt-1">
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                            </div>
                            {/* Text */}
                            <div className="flex flex-col text-base text-gray-500">
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">เช้า:</p>
                                    <p className="leading-relaxed">เริ่มออกรถเดินทางไปในตอนเช้าและแวะชมวิว<br />เชื่อมจุดต่างๆ อาหารเช้าพร้อมชมวิวแวะเรือ<br />เดิน แวะที่เขาช่องลม</p>
                                </div>
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                                    <p className="leading-relaxed">เดินทางไปตามอาหารและดื่มกาแฟร้าน<br />Tree house cafe<br />และเดินเดินทางไปเขาใหญ่ต่อ</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                                    <p className="leading-relaxed">เข้าที่พักที่เขาใหญ่<br />suggest: B2 Khao Yai Premier Hotel</p>
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="flex flex-col gap-3 flex-1">
                            <img src={trip1a} alt="day1-1" className="w-full object-cover rounded-xl" style={{ height: 380 }} />
                            <div className="flex gap-4">
                                <img src={trip1b} alt="day1-2" className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                                <img src={trip1c} alt="day1-3" className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── DAY 02: images left, timeline right ── */}
                <div className="flex gap-8 items-start">
                    {/* images */}
                    <div className="w-full max-w-xl mx-auto p-2">
                        {/* items-stretch จะดึงให้ div ลูกทั้งสองฝั่งสูงเท่ากันเสมอ */}
                        <div className="flex flex-row items-stretch gap-2">

                            {/* รูปฝั่งซ้าย: กว้าง 60% */}
                            <div className="w-[60%]">
                                <img
                                    src={trip1d}
                                    alt="Waterfall"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>

                            {/* รูปฝั่งขวา: กว้าง 40% (สูงเท่ากันด้วย h-full) */}
                            <div className="w-[40%]">
                                <img
                                    src={trip1f}
                                    alt="Activity"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="w-full pt-2">
                            <img
                                src={trip1h} // เปลี่ยนเป็นตัวแปรชื่อรูปที่ต้องการ
                                alt="Bottom Image"
                                className="w-full aspect-[16/9] object-cover rounded-xl"
                            />
                        </div>
                    </div>
                    {/* <div className="flex flex-col gap-4 flex-1">
                            <img src={trip1e} alt="day1-1" className="w-full object-cover rounded-xl" style={{ height: 380 }} />
                            <div className="flex gap-4">
                                <img src={trip1d} alt="day1-2" className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                                <img src={trip1f} alt="day1-3" className="flex-1 object-cover rounded-xl" style={{ height: 180 }} />
                            </div> */}
                    {/* Right side: header + timeline */}
                    <div className="flex-1 pt-2">
                        {/* Day header (right-aligned) */}
                        <div className="flex flex-col items-end">
                            <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>02</span>
                            <div className="flex items-center gap-2 flex-row-reverse" style={{ marginTop: -6 }}>
                                <div className="h-px w-12 bg-[#7DA2B6]" />
                                <span className="text-sm text-[#7DA2B6] font-medium">Start day2</span>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex gap-5 mt-6">
                            {/* Dots */}
                            <div className='pl-20'>
                                <div className="flex flex-col items-center pt-1">
                                    <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                    <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                    <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                    <div className="w-0.5 bg-[#7DA2B6]" style={{ height: 120 }} />
                                    <div className="w-5 h-5 rounded-full bg-[#7DA2B6]" />
                                </div>
                            </div>
                            {/* Text */}
                            <div className="flex flex-col text-base text-gray-500">
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">เช้า – สาย:</p>
                                    <p className="leading-relaxed">เข้าอุทยานแห่งชาติเขาใหญ่และ<br />จุดชมวิวผาเดียวดาย<br />ต่อด้วยเที่ยวน้ำตกเหมาะวัต</p>
                                </div>
                                <div style={{ minHeight: 140 }}>
                                    <p className="font-semibold text-gray-700 text-lg">บ่าย:</p>
                                    <p className="leading-relaxed">กินข้าวที่ร้าน<br />เขาใหญ่เดินเข้าล้าและหายเรือ<br />ที่ลำตะเคอง</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 text-lg">เย็น:</p>
                                    <p className="leading-relaxed">ดินเนอร์สุดน่าจดจำที่ The<br />Castle Restaurant & Tea<br />Room และกลับที่พัก</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── DAY 03: centered header + stop ── */}
                <div>
                    {/* Day header (centered) */}
                    <div className="flex flex-col items-center">
                        <span className="font-extrabold text-[#d0d4d6]" style={{ fontSize: 110, letterSpacing: '-4px', lineHeight: 1 }}>03</span>
                        <div className="flex items-center gap-2" style={{ marginTop: -6 }}>
                            <div className="h-px w-12 bg-[#7DA2B6]" />
                            <span className="text-sm text-[#7DA2B6] font-medium">Start day3</span>
                            <div className="h-px w-12 bg-[#7DA2B6]" />
                        </div>
                    </div>

                    <div className="flex gap-4 items-start mt-8">
                        <div className="w-5 h-5 rounded-full bg-[#7DA2B6] shrink-0 mt-1" />
                        <div className="text-base text-gray-500">
                            <p className="font-semibold text-gray-700 text-lg">แวะที่ Pirom Cafe</p>
                            <p className="leading-relaxed">กินอาหารเช้าสมัยที่บ้านสาว เขาใหญ่<br />และเดินทางกลับ</p>
                        </div>
                    </div>

                    {/* Images for day 3 */}
                    <div className="flex gap-4 mt-8">
                        <img src={trip1f} alt="day3-1" className="flex-1 object-cover rounded-xl" style={{ height: 280 }} />
                        <img src={trip1g} alt="day3-2" className="flex-1 object-cover rounded-xl" style={{ height: 280 }} />
                    </div>
                </div>

            </div>

            {/* ── Footer ── */}
            <footer className="bg-[#E4D6C5] py-8 px-10 mt-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                    <span className="text-[#984216] font-extrabold text-lg tracking-widest">TRAVELTHAI</span>
                    <div className="flex flex-col gap-1 text-right">
                        <div className="flex gap-10 justify-end">
                            <span className="text-[#984216] text-sm">Tamonpan Poonnotok</span>
                            <span className="text-[#984216] text-sm w-16 text-right">66070085</span>
                        </div>
                        <div className="flex gap-10 justify-end">
                            <span className="text-[#984216] text-sm">Saranya Kaewpipop</span>
                            <span className="text-[#984216] text-sm w-16 text-right">66070210</span>
                        </div>
                        <div className="flex gap-10 justify-end">
                            <span className="text-[#984216] text-sm">Adsadawut Thammawanit</span>
                            <span className="text-[#984216] text-sm w-16 text-right">66070321</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}
