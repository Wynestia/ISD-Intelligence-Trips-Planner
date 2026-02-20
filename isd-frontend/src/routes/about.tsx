import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* <!-- Main --> */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">

        <h1 className="text-2xl font-bold mb-2">เริ่มจัดแผนเที่ยวของคุณกัน !</h1>

        <p className="text-gray-600 mb-8">ใส่คำอธิบายการท่องเที่ยวที่คุณอยากไป</p>

        {/* <!-- Input Box --> */}
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow flex items-center px-6 py-4">
          <input
            type="text"
            placeholder="เพิ่มรูปแบบการท่องเที่ยวที่คุณอยากไป"
            className="flex-1 outline-none text-gray-700"
          />

          <button className="ml-4 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">▶</button>
        </div>

      </main>

    </div>
  )
}
