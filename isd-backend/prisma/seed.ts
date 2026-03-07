import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const session1AiReply1 = JSON.stringify({
    output: {
        intent: "วางแผนทริป",
        preferences: {
            target_group: "คู่รัก",
            budget: null,
            style: "โรแมนติก",
        },
        missing_info: [
            "โซนที่เฉพาะเจาะจง",
            "จุดเริ่มต้นการเดินทาง",
            "กิจกรรมเพิ่มเติม",
        ],
        plan: [
            { time: "09:30", location: "วัดโพธิ์", activity: "เดินเล่นชมวิวแม่น้ำเจ้าพระยา" },
            { time: "11:00", location: "วัดอรุณ", activity: "ชมพระอาทิตย์ตกและถ่ายรูปสวย" },
            { time: "12:30", location: "ริมแม่น้ำเจ้าพระยา", activity: "พายเรือชมวิวแม่น้ำ" },
            { time: "14:30", location: "วินเซนท์สแควร์", activity: "รับประทานอาหารและชมบรรยากาศโรแมนติก" },
            { time: "17:00", location: "ริมแม่น้ำเจ้าพระยา", activity: "ชมพระอาทิตย์ตกและมิวสิกไลฟ์" },
        ],
        reasoning: [
            "การเลือกวัดโพธิ์และวัดอรุณเพราะมีบรรยากาศโรแมนติกและวิวแม่น้ำที่สวยงาม",
            "การพายเรือช่วยสร้างประสบการณ์ที่โรแมนติกและสุขสันต์",
            "วินเซนท์สแควร์เหมาะสำหรับมื้อโรแมนติก",
        ],
        tips: [
            "ควรแต่งชุดแบบ Formal หรือเสื้อยืดสำหรับการเดินเล่น",
            "ไม่ควรลืมถ่ายรูปสวยๆ ระหว่างการเดิน",
            "พาโทรศัพท์มือถือเพื่อเช็คการเดินทาง",
        ],
    },
});

const session1AiReply2 = JSON.stringify({
    output: {
        intent: "สอบถามข้อมูล",
        preferences: {
            target_group: "คู่รัก",
            budget: null,
            style: "โรแมนติก",
        },
        missing_info: [],
        plan: [
            { time: "11:00–01:00", location: "เชียงใหม่", activity: "ช่วงฤดูหนาว (พ.ย.–ก.พ.) อากาศเย็นสบาย 15–22°C" },
            { time: "03:00–05:00", location: "เชียงใหม่", activity: "หลีกเลี่ยงช่วงหน้าร้อน (มี.ค.–พ.ค.) อากาศร้อนและมีหมอกควัน" },
        ],
        reasoning: [
            "อากาศหนาวเย็นในเดือนพฤศจิกายน–กุมภาพันธ์เหมาะกับการเที่ยวกลางแจ้งและดอยต่างๆ",
        ],
        tips: [
            "จองที่พักล่วงหน้าในช่วง High Season (ธ.ค.–ม.ค.)",
            "นำเสื้อกันหนาวไปด้วยเพราะอากาศเย็นมากในตอนเช้า",
        ],
    },
});

const session2AiReply1 = JSON.stringify({
    output: {
        intent: "วางแผนทริปประหยัด",
        preferences: {
            target_group: "เดี่ยว",
            budget: "ต่ำ",
            style: "ประหยัด",
        },
        missing_info: ["จุดหมายปลายทาง", "ระยะเวลา"],
        plan: [
            { time: "ก่อนเดินทาง", location: "ออนไลน์", activity: "จองที่พักล่วงหน้า 2–4 สัปดาห์" },
            { time: "ระหว่างทาง", location: "สถานีขนส่ง", activity: "ใช้รถไฟหรือรถบัสทัวร์แทนเครื่องบิน" },
            { time: "มื้ออาหาร", location: "ตลาดท้องถิ่น", activity: "กินอาหารตามสั่งในตลาดชุมชน 40–80 บาท/จาน" },
        ],
        reasoning: [
            "การจองล่วงหน้าลดค่าใช้จ่ายได้ 30–50%",
            "อาหารตลาดราคาถูกและอร่อยกว่าร้านท่องเที่ยว",
        ],
        tips: [
            "ใช้แอป Booking.com หรือ Agoda เปรียบเทียบราคาที่พัก",
            "ซื้อน้ำและของว่างจากร้านสะดวกซื้อแทนในแหล่งท่องเที่ยว",
            "เช็คโปรโมชันรถไฟฟ้า/บัสฟรีในเมืองใหญ่",
        ],
    },
});

const session2AiReply2 = JSON.stringify({
    output: {
        intent: "แนะนำที่พัก",
        preferences: {
            target_group: "เดี่ยว/กลุ่ม",
            budget: "ต่ำ",
            style: "ประหยัด",
        },
        missing_info: ["เมืองที่ต้องการ"],
        plan: [
            { time: "ตัวเลือกที่ 1", location: "Hostel", activity: "ราคา 200–400 บาท/คืน รวมเตียง WiFi บางแห่งมีอาหารเช้า" },
            { time: "ตัวเลือกที่ 2", location: "Guesthouse", activity: "ราคา 350–600 บาท/คืน ห้องส่วนตัวบรรยากาศดี" },
            { time: "ตัวเลือกที่ 3", location: "เกสต์เฮ้าส์ในชุมชน", activity: "ราคา 200–300 บาท/คืน บรรยากาศท้องถิ่นแท้" },
        ],
        reasoning: [
            "Hostel เหมาะสำหรับนักเดินทางเดี่ยวที่ต้องการพบเพื่อนใหม่",
            "Guesthouse ให้ความเป็นส่วนตัวมากกว่าในราคาที่ยังประหยัด",
        ],
        tips: [
            "อ่านรีวิวบน Booking.com ก่อนจองทุกครั้ง",
            "เช็คนโยบายการยกเลิกฟรีเผื่อแผนเปลี่ยน",
        ],
    },
});

async function main() {
    await prisma.chatMessage.deleteMany();
    await prisma.chatSession.deleteMany();

    const user = await prisma.user.upsert({
        where: { email: "demo@example.com" },
        update: {},
        create: {
            firstName: "Demo",
            lastName: "User",
            email: "demo@example.com",
            password: "hashed_password",
            phoneNumber: "0812345678",
            birthday: new Date("1995-01-01"),
            gender: "other",
        },
    });

    // Session 1
    const session1 = await prisma.chatSession.create({ data: { user_id: user.id, title: "วางแผนเที่ยวเชียงใหม่" } });
    await prisma.chatMessage.createMany({
        data: [
            { session_id: session1.chat_id, role: "user", content: "อยากไปเที่ยวเชียงใหม่ 3 วัน 2 คืนกับแฟน มีที่แนะนำไหม?", token_count: 14 },
            { session_id: session1.chat_id, role: "ai", content: session1AiReply1, token_count: 80 },
            { session_id: session1.chat_id, role: "user", content: "ช่วงไหนของปีที่อากาศดีที่สุด?", token_count: 8 },
            { session_id: session1.chat_id, role: "ai", content: session1AiReply2, token_count: 60 },
        ],
    });

    // Session 2
    const session2 = await prisma.chatSession.create({ data: { user_id: user.id, title: "เที่ยวประหยัดงบ" } });
    await prisma.chatMessage.createMany({
        data: [
            { session_id: session2.chat_id, role: "user", content: "อยากเที่ยวไทยแบบประหยัดงบ มีเทคนิคอะไรบ้าง?", token_count: 10 },
            { session_id: session2.chat_id, role: "ai", content: session2AiReply1, token_count: 70 },
            { session_id: session2.chat_id, role: "user", content: "ที่พักราคาถูกแต่ดีมีแนะนำไหม?", token_count: 8 },
            { session_id: session2.chat_id, role: "ai", content: session2AiReply2, token_count: 65 },
        ],
    });

    console.log("✅ Seed completed!");
    console.log(`  User: ${user.email} (id: ${user.id})`);
    console.log(`  Session 1: "${session1.title}" (id: ${session1.chat_id})`);
    console.log(`  Session 2: "${session2.title}" (id: ${session2.chat_id})`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
