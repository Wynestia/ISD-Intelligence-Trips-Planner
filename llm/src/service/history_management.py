"""Module สำหรับการจัดการ LLM Conversation History แบบ In-Memory"""

from groq import Groq
import os


class HistoryManagement:
    """
    จัดการ conversation history ของ LLM แบบ in-memory
    - เก็บ history ทุก turn (user + assistant) ไว้ใน memory
    - ถ้า history มีมากกว่า 6
      → สรุปทุก message ยกเว้น 2 อันสุดท้าย แล้วแทนที่ด้วย summary message เดียว
      → ผล: [summary_msg, second_last_msg, last_msg]
    """

    MAX_MESSAGES = 6  # threshold ที่จะ trigger การ compress

    def __init__(self, api_key: str | None = None, model: str = "llama-3.1-8b-instant"):
        _key = api_key or os.environ.get("GROQ_API_KEY")
        if not _key:
            raise ValueError("ต้องระบุ GROQ_API_KEY เพื่อใช้งาน HistoryManagement")

        self._client = Groq(api_key=_key)
        self._model = model
        self._history: list[dict] = []  # list ของ {"role": ..., "content": ...}

    def add_user_message(self, content: str) -> None:
        """เพิ่ม message ของ user เข้า history"""
        self._add(role="user", content=content)

    def add_assistant_message(self, content: str) -> None:
        """เพิ่ม message ของ assistant เข้า history"""
        self._add(role="assistant", content=content)

    def get_history(self) -> list[dict]:
        """คืน history ปัจจุบัน (shallow copy)"""
        return list(self._history)

    def clear(self) -> None:
        """ล้าง history ทั้งหมด"""
        self._history = []

    def __len__(self) -> int:
        return len(self._history)

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _add(self, role: str, content: str) -> None:
        """เพิ่ม message แล้วตรวจสอบว่าต้อง compress หรือไม่"""
        self._history.append({"role": role, "content": content})
        if len(self._history) > self.MAX_MESSAGES:
            self._compress()

    def _compress(self) -> None:
        """
        สรุป history ทุกอัน ยกเว้น 2 อันสุดท้าย
        แล้วแทนที่ history ด้วย [summary_msg, *last_two]
        """
        last_two = self._history[-2:]
        to_summarize = self._history[:-2]

        summary_text = self._summarize(to_summarize)

        summary_msg = {
            "role": "system",
            "content": (
                "[สรุปบทสนทนาก่อนหน้า]\n"
                f"{summary_text}"
            ),
        }

        self._history = [summary_msg] + last_two
        print(f"📝 History compressed → {len(self._history)} messages (1 summary + 2 recent)")

    def _summarize(self, messages: list[dict]) -> str:
        """
        เรียก LLM เพื่อสรุป messages ที่ส่งมา
        คืนค่าเป็น string สรุป
        """
        # สร้าง transcript ให้ LLM อ่าน
        transcript_lines = []
        for msg in messages:
            role_label = "ผู้ใช้" if msg["role"] == "user" else "ผู้ช่วย"
            transcript_lines.append(f"{role_label}: {msg['content']}")
        transcript = "\n".join(transcript_lines)

        system_prompt = (
            "คุณคือผู้ช่วยที่ทำหน้าที่สรุปบทสนทนา "
            "สรุปให้กระชับ ครอบคลุมประเด็นสำคัญ ใช้ภาษาเดียวกับบทสนทนา"
        )
        user_prompt = (
            f"สรุปบทสนทนาต่อไปนี้ให้กระชับและครอบคลุมประเด็นสำคัญ:\n\n{transcript}"
        )

        completion = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )

        return completion.choices[0].message.content.strip()