
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/regist')({
    component: RegistComponent,
})

function RegistComponent() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        gender: ''
    });

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const currentYear = new Date().getFullYear() + 543; // Thai year
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const django_submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
            alert("Please select your birthday");
            return;
        }

        const { confirmPassword, birthDay, birthMonth, birthYear, ...rest } = formData;
        const birthday = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

        try {
            const response = await fetch('http://localhost:3123/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...rest, birthday })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful");
                navigate({ to: '/login' });
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred");
        }
    };

    return (
        // <div className="relative h-full">
        //   <img className="w-full h-full object-cover" src="src/assets/regist.jpg" />

        //   {/* เบลอด้านบน (ติด navbar) */}
        //   <div className="absolute top-0 left-0 right-0 h-24 
        //                   bg-gradient-to-b from-[#f5f0e8] to-transparent" />

        //   {/* เบลอด้านล่าง */}
        //   <div className="absolute bottom-0 left-0 right-0 h-24 
        //                   bg-gradient-to-t from-[#f5f0e8] to-transparent" />
        // </div>

        <div className="flex min-h-screen">
            {/* Left Side - Image */}
            <div className="hidden lg:block w-1/2 relative bg-gray-100">
                <img
                    src="src/assets/regist.jpg"
                    alt="regist pic"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* เบลอด้านบน */}
                <div className="absolute top-0 left-0 right-0 h-40 
                      bg-gradient-to-b from-[#f5f0e8] via-[#f5f0e8]/40 to-transparent" />

                {/* เบลอด้านล่าง */}
                <div className="absolute bottom-0 left-0 right-0 h-40
                      bg-gradient-to-t from-[#f5f0e8] via-[#f5f0e8]/40 to-transparent" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 py-12">
                <div className="w-full max-w-lg">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-4xl font-bold text-[var(--burnt-sienna)] mb-6">Sign Up</h1>
                    </div>

                    <form className="space-y-4" onSubmit={django_submit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="firstName"
                                onChange={handleChange}
                                type="text"
                                placeholder="กรอกชื่อของคุณ"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="lastName"
                                onChange={handleChange}
                                type="text"
                                placeholder="กรอกนามสกุลของคุณ"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="password"
                                onChange={handleChange}
                                type="password"
                                placeholder="กรอกรหัสผ่านของคุณ"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password Confirmation <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="confirmPassword"
                                onChange={handleChange}
                                type="password"
                                placeholder="กรอกรหัสผ่านของคุณ"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mobile phone number <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="phoneNumber"
                                onChange={handleChange}
                                type="tel"
                                placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Birthday <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select name="birthDay" onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]">
                                    <option value="">วัน</option>
                                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select name="birthMonth" onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]">
                                    <option value="">เดือน</option>
                                    {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                </select>
                                <select name="birthYear" onChange={handleChange} className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]">
                                    <option value="">ปี</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select name="gender" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]">
                                <option value=""></option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                                <option value="other">อื่นๆ</option>
                            </select>
                        </div>

                        <div className="flex items-center pt-2">
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
                            className="w-full bg-[var(--burnt-sienna)] text-white py-3 rounded hover:bg-[var(--ivory-sand)] hover:text-[var(--burnt-sienna)] transition-colors font-medium"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-gray-600">
                        หากคุณสมัครสมาชิกแล้ว <Link to="/login" className="text-(--burnt-sienna) hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
