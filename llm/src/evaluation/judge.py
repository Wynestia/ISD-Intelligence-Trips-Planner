import json
from groq import Groq

class TripJudge:
    def __init__(self, api_key: str, model: str = "llama-3.3-70b-versatile"):
        self.client = Groq(api_key=api_key)
        self.model = model

    def evaluate_plan(self, user_query: str, plan_json: str) -> dict:
        """
        Evaluates a travel plan using LLM-as-a-Judge based on specific rubrics.
        """
        prompt = f"""คุณคือผู้เชี่ยวชาญด้านการประเมินแผนการท่องเที่ยว (Quality Assurance Judge)
หน้าที่ของคุณคือให้คะแนนแผนการท่องเที่ยวที่ AI สร้างขึ้น ตามเกณฑ์ที่กำหนดอย่างเข้มงวด

[USER QUERY]
"{user_query}"

[TRAVEL PLAN JSON]
{plan_json}

---
[RUBRICS] คะแนนเต็ม 10 ในแต่ละหัวข้อ:
1. **Accuracy (ความถูกต้อง)**: สถานที่และกิจกรรมมีความสมเหตุสมผลและมีอยู่จริงหรือไม่ (1-10)
2. **Relevance (ความตรงโจทย์)**: ตอบโจทย์ความต้องการของผู้ใช้และสไตล์ที่ระบุหรือไม่ (1-10)
3. **Logistics (ความสมเหตุสมผลเชิงเทคนิค)**: เวลาเดินทางและลำดับกิจกรรมเป็นไปได้จริงหรือไม่ ไม่แน่นเกินไป (1-10)
4. **Detail & Richness (ความละเอียด)**: กิจกรรม (Activity) ต้องมีรายละเอียดที่เห็นภาพ (Vivid) ไม่สั้นจนเกินไป (15-30 คำต่อ stop) และมีคำแนะนำเฉพาะทาง (1-10)
5. **Safety & Tips (ความปลอดภัยและคำแนะนำ)**: Tips มีประโยชน์และใช้ได้จริงหรือไม่ (1-10)

ให้ส่งผลลัพธ์เป็น JSON เท่านั้น พร้อมคำอธิบายสั้นๆ (Feedback)

[OUTPUT FORMAT]
{{
    "scores": {{
        "accuracy": int,
        "relevance": int,
        "logistics": int,
        "safety_tips": int
    }},
    "total_score": float,
    "feedback": "string (ภาษาไทย)",
    "recommendation": "PASS" หรือ "REVISION_NEEDED"
}}
"""
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a strict travel quality control agent."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            eval_result = json.loads(completion.choices[0].message.content)
            
            # Calculate total score average
            scores = eval_result.get("scores", {})
            if scores:
                eval_result["total_score"] = sum(scores.values()) / len(scores)
            
            # Auto-recommendation based on threshold (e.g., 7.0)
            if eval_result.get("total_score", 0) >= 7.0:
                eval_result["recommendation"] = "PASS"
            else:
                eval_result["recommendation"] = "REVISION_NEEDED"
                
            return eval_result
            
        except Exception as e:
            return {"error": str(e), "total_score": 0, "recommendation": "ERROR"}
