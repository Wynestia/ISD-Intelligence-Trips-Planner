import os
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from groq import Groq
from fewshot_search import FewShotSearchEngine

# เพิ่ม path เพื่อให้ import จาก folder อื่นได้
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from evaluation.judge import TripJudge

class GroqTravelAnalyst:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)
        self.api_key = api_key
        self.base_dir = os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        )
        # Init FewShotSearchEngine
        examples_path = os.path.join(
            self.base_dir, 'prompts', 'experiment', 'examples.json'
        )
        self.fewshot_engine = FewShotSearchEngine(examples_path=examples_path)
        # Init Evaluator
        self.evaluator = TripJudge(api_key=api_key)

    def _load_prompt(self, filename, folder="base"):
        dir_map = {
            "base": os.path.join(self.base_dir, "prompts", "base"),
            "experiment": os.path.join(self.base_dir, "prompts", "experiment"),
        }
        path = os.path.join(dir_map[folder], filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"ไม่พบไฟล์ prompt ที่: {path}")
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def _get_completion(self, system_prompt, user_prompt, model="llama-3.1-8b-instant"):
        """Helper to call Groq API"""
        completion = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={"type": "json_object"}
        )
        return completion.choices[0].message.content

    def analyze_trip(self, user_query: str, n_samples: int = 3, verify: bool = True, evaluate: bool = True) -> dict:
        system_prompt = self._load_prompt('system_prompt.txt')
        task_template = self._load_prompt('task_template.txt')
        fewshot_block = self.fewshot_engine.build_fewshot_block(user_query)
        cot_prompt = self._load_prompt('chain_of_thought.txt', folder="experiment")
        
        context = {
            "examples":   fewshot_block,
            "cot_prompt": cot_prompt,
            "user_query": user_query,
        }
        full_prompt = task_template.format_map(context)

        try:
            # --- Pass 1: Self-Consistency (Parallel Sampling) ---
            print(f"🚀 Running Self-Consistency with {n_samples} samples...")
            with ThreadPoolExecutor(max_workers=n_samples) as executor:
                futures = [
                    executor.submit(self._get_completion, system_prompt, full_prompt)
                    for _ in range(n_samples)
                ]
                candidates = [f.result() for f in futures]

            # --- Pass 2: Best Candidate Selection (Judge) ---
            print("⚖️ Judging best candidate...")
            candidate_texts = [f"--- CANDIDATE {i+1} ---\n{c}" for i, c in enumerate(candidates)]
            all_candidates_str = "\n".join(candidate_texts)
            
            judge_prompt = f"""ด้านล่างนี้คือแผนการท่องเที่ยวจำนวน {n_samples} แบบ สำหรับคำถาม: "{user_query}"
โปรดพิจารณาและเลือกเพียง 1 แผนที่ดีที่สุด ซึ่งมีความละเอียดมากที่สุด มีเหตุผลเชิงตรรกะชัดเจน และสอดคล้องกับรูปแบบที่กำหนดครบถ้วน
ห้ามแก้ไขเนื้อหาของแผนที่เลือก ให้ส่งคืนเฉพาะ JSON object ของแผนที่ดีที่สุดเท่านั้น
CANDIDATES:
{all_candidates_str}
"""
            best_result = self._get_completion(
                "คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยว ทำหน้าที่เป็นผู้ตัดสินประเมินแผนการเดินทาง",
                judge_prompt,
                model="llama-3.3-70b-versatile"
            )

            final_plan = best_result

            # --- Pass 3: Chain-of-Verification (CoVe) ---
            if verify:
                print("🛡️ Verifying plan correctness...")
                verification_template = self._load_prompt('verification_template.txt', folder="experiment")
                verify_prompt = verification_template.format(initial_plan=best_result)

                final_plan = self._get_completion(
                    "คุณเป็นผู้ตรวจสอบแผนการท่องเที่ยวที่พิถีพิถันและเข้มงวด ตรวจสอบให้แน่ใจว่าทุกรายละเอียดมีความสมจริง",
                    verify_prompt,
                    model="llama-3.3-70b-versatile"
                )

            # --- Pass 4: LLM-as-a-Judge (Validation Layer) ---
            output_data = {"plan": json.loads(final_plan)}
            if evaluate:
                print("📊 Performing LLM-as-a-Judge evaluation...")
                eval_report = self.evaluator.evaluate_plan(user_query, final_plan)
                output_data["evaluation"] = eval_report

            return output_data

        except Exception as e:
            return {"error": str(e)}


# --- print helper ---
def print_result(result_dict):
    print("\n" + "=" * 50)
    print(json.dumps(result_dict, indent=2, ensure_ascii=False))
    print("=" * 50)
    

# --- รันโปรแกรม ---
if __name__ == "__main__":
    MY_KEY = os.environ.get("GROQ_API_KEY")
    if not MY_KEY:
        raise EnvironmentError("กรุณา set GROQ_API_KEY ใน environment variable")

    analyst = GroqTravelAnalyst(api_key=MY_KEY)
    result = analyst.analyze_trip("มีเงิน 1500 ไปเที่ยวชิค ๆ คูล 1 วันไปคนเดียวเท่ ๆ ในกรุงเทพ", n_samples=3, verify=True, evaluate=True)
    print_result(result)
