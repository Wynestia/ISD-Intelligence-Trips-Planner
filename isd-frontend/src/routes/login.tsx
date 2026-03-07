import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})

function LoginComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.dispatchEvent(new Event('auth-change')); // notify Header to update
        alert("Login successful");
        navigate({ to: '/' }); // Redirect to home/dashboard
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-10 bg-black/30"></div>
        <img
          src="src/assets/loginpic.jpg"
          alt="Girl with a Pearl Earring"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-white/80 text-6xl font-serif font-bold p-12 leading-tight">
          WEL<br />COME<br />BACK!
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-[#984216] mb-10">Log In</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#984216] mb-1">
                Email <span className="text-[#984216]">*</span>
              </label>
              <input
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="กรอกอีเมลของคุณ"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#984216] mb-1">
                Password <span className="text-[#984216]">*</span>
              </label>
              <input
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="กรอกรหัสผ่านของคุณ"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
              />
              <div className="text-right mt-1">
                <a href="#" className="text-xs text-gray-500 hover:underline">ลืมรหัสผ่าน?</a>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-[#1a1b4b] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                ฉันยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#984216] text-white py-3 rounded hover:bg-[#E4D6C5] hover:text-[#984216] hover:border-[#984216] transition-colors font-medium"
            >
              Log In
            </button>
          </form>

          <p className="mt-8 text-sm text-gray-600">
            หากคุณยังไม่ได้สมัครสมาชิก <Link to="/regist" className="text-[#984216] hover:underline">สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
