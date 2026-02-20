import os
import json
from groq import Groq
from fewshot_search import FewShotSearchEngine

class GroqTravelAnalyst:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)
        self.base_dir = os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        )
        # Init FewShotSearchEngine
        examples_path = os.path.join(
            self.base_dir, 'prompts', 'experiment', 'examples.json'
        )
        self.fewshot_engine = FewShotSearchEngine(examples_path=examples_path)

        # Chain-of-Thought
        self.cot_dir = os.path.join(self.base_dir, 'prompts', 'experiment', 'chain_of_thought.txt')

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

    def analyze_trip(self, user_query: str, verify: bool = True) -> str:
        system_prompt = self._load_prompt('system_prompt.txt')
        task_template = self._load_prompt('task_template.txt')

        # ดึง fewshot ที่ semantic ใกล้เคียงที่สุด
        fewshot_block = self.fewshot_engine.build_fewshot_block(user_query)
        # เรียก Chain-of-Thought
        cot_prompt = self._load_prompt('chain_of_thought.txt', folder="experiment")
        context = {
            "examples":   fewshot_block,
            "cot_prompt": cot_prompt,
            "user_query": user_query,
        }
        full_prompt = task_template.format_map(context)

        try:
            # --- Pass 1: Generate Initial Plan ---
            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_prompt}
                ],
                response_format={"type": "json_object"}
            )
            initial_result = completion.choices[0].message.content

            if not verify:
                return initial_result

            # --- Pass 2: Chain-of-Verification (CoVe) ---
            verification_template = self._load_prompt('verification_template.txt', folder="experiment")
            verify_prompt = verification_template.format(initial_plan=initial_result)

            verification_completion = self.client.chat.completions.create(
                model="llama-3.1-70b-versatile",  # ใช้โมเดลใหญ่ขึ้นเพื่อตรวจสอบ
                messages=[
                    {"role": "system", "content": "You are a picky travel agent auditor. Ensure all details are realistic."},
                    {"role": "user", "content": verify_prompt}
                ],
                response_format={"type": "json_object"}
            )
            return verification_completion.choices[0].message.content

        except Exception as e:
            return json.dumps({"error": str(e)}, ensure_ascii=False)


# --- print helper ---
def print_result(result):
    print("\n" + "=" * 50)
    print(result)
    print("=" * 50)
    


# --- รันโปรแกรม ---
if __name__ == "__main__":
    MY_KEY = os.environ.get("GROQ_API_KEY")
    if not MY_KEY:
        raise EnvironmentError("กรุณา set GROQ_API_KEY ใน environment variable")

    analyst = GroqTravelAnalyst(api_key=MY_KEY)
    result = analyst.analyze_trip("อยากพาแฟนไปเดทริมน้ำ")
    print_result(result)