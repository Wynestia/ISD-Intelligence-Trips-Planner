import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { prisma } from "../libs/prisma";

const SIMULATED_AI_REPLY = (userMsg: string) =>
    JSON.stringify({
        output: {
            intent: "วางแผนทริป",
            preferences: {
                target_group: "ไม่ระบุ",
                budget: null,
                style: "ทั่วไป",
            },
            missing_info: [
                "จุดหมายปลายทางที่ต้องการ",
                "จำนวนวันที่ต้องการเดินทาง",
                "งบประมาณโดยประมาณ",
            ],
            plan: [
                { time: "09:00", location: "จุดเริ่มต้น", activity: `รับข้อมูลเพิ่มเติมสำหรับ: "${userMsg}"` },
                { time: "—", location: "รอข้อมูล", activity: "กรุณาระบุรายละเอียดเพิ่มเติมเพื่อวางแผนให้ดียิ่งขึ้น" },
            ],
            reasoning: [
                `ได้รับคำถาม: "${userMsg}"`,
                "ระบบ AI ยังอยู่ระหว่างการพัฒนา — ตอบนี้เป็น Mock Response",
            ],
            tips: [
                "ลองระบุจุดหมายปลายทางที่ต้องการเที่ยว",
                "บอกจำนวนวันและงบประมาณเพื่อให้ได้แผนที่แม่นยำขึ้น",
            ],
        },
    });

// Helper: extract & verify JWT from Authorization header
const jwtPlugin = jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET || "secret",
});

async function getUserId(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwtInstance: any,
    headers: Record<string, string | undefined>
): Promise<number | null> {
    const auth = headers["authorization"] ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return null;
    const payload = await jwtInstance.verify(token);
    if (!payload || typeof payload !== "object" || !payload.id) return null;
    return Number(payload.id);
}

export const chatRoutes = new Elysia({ prefix: "/chat" })
    .use(jwtPlugin)

    // ── Sessions ──────────────────────────────────────────────────────────────
    .get(
        "/sessions",
        async ({ jwt, headers, set }) => {
            const userId = await getUserId(jwt, headers as Record<string, string | undefined>);
            if (!userId) { set.status = 401; return { message: "Unauthorized" }; }

            return await prisma.chatSession.findMany({
                where: { user_id: userId },
                orderBy: { create_at: "desc" },
                include: {
                    messages: {
                        orderBy: { create_at: "desc" },
                        take: 1,
                    },
                },
            });
        },
        { detail: { tags: ["Chat"] } }
    )
    .post(
        "/sessions",
        async ({ jwt, headers, body, set }) => {
            const userId = await getUserId(jwt, headers as Record<string, string | undefined>);
            if (!userId) { set.status = 401; return { message: "Unauthorized" }; }

            return await prisma.chatSession.create({
                data: { user_id: userId, title: body.title },
                include: { messages: true },
            });
        },
        {
            body: t.Object({ title: t.String() }),
            detail: { tags: ["Chat"] },
        }
    )
    .delete(
        "/sessions/:id",
        async ({ jwt, headers, params: { id }, set }) => {
            const userId = await getUserId(jwt, headers as Record<string, string | undefined>);
            if (!userId) { set.status = 401; return { message: "Unauthorized" }; }

            // Verify the session belongs to this user
            const session = await prisma.chatSession.findUnique({ where: { chat_id: Number(id) } });
            if (!session || session.user_id !== userId) { set.status = 403; return { message: "Forbidden" }; }

            await prisma.chatMessage.deleteMany({ where: { session_id: Number(id) } });
            await prisma.chatSession.delete({ where: { chat_id: Number(id) } });
            set.status = 204;
            return null;
        },
        {
            params: t.Object({ id: t.Numeric() }),
            detail: { tags: ["Chat"] },
        }
    )

    // ── Messages ──────────────────────────────────────────────────────────────
    .get(
        "/sessions/:id/messages",
        async ({ jwt, headers, params: { id }, set }) => {
            const userId = await getUserId(jwt, headers as Record<string, string | undefined>);
            if (!userId) { set.status = 401; return { message: "Unauthorized" }; }

            // Verify session ownership
            const session = await prisma.chatSession.findUnique({ where: { chat_id: Number(id) } });
            if (!session || session.user_id !== userId) { set.status = 403; return { message: "Forbidden" }; }

            return await prisma.chatMessage.findMany({
                where: { session_id: Number(id) },
                orderBy: { create_at: "asc" },
            });
        },
        {
            params: t.Object({ id: t.Numeric() }),
            detail: { tags: ["Chat"] },
        }
    )
    .post(
        "/sessions/:id/messages",
        async ({ jwt, headers, params: { id }, body, set }) => {
            const userId = await getUserId(jwt, headers as Record<string, string | undefined>);
            if (!userId) { set.status = 401; return { message: "Unauthorized" }; }

            const sessionId = Number(id);

            // Verify session ownership
            const session = await prisma.chatSession.findUnique({ where: { chat_id: sessionId } });
            if (!session || session.user_id !== userId) { set.status = 403; return { message: "Forbidden" }; }

            const userMessage = await prisma.chatMessage.create({
                data: {
                    session_id: sessionId,
                    role: "user",
                    content: body.content,
                    token_count: body.content.split(" ").length,
                },
            });

            const aiContent = SIMULATED_AI_REPLY(body.content);
            const aiMessage = await prisma.chatMessage.create({
                data: {
                    session_id: sessionId,
                    role: "ai",
                    content: aiContent,
                    token_count: aiContent.split(" ").length,
                },
            });

            return { userMessage, aiMessage };
        },
        {
            params: t.Object({ id: t.Numeric() }),
            body: t.Object({ content: t.String({ minLength: 1 }) }),
            detail: { tags: ["Chat"] },
        }
    );
