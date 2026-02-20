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
        self.prompt_dir = os.path.join(self.base_dir, 'prompts', 'base')

        # Init FewShotSearchEngine
        examples_path = os.path.join(
            self.base_dir, 'prompts', 'experiment', 'examples.json'
        )
        self.fewshot_engine = FewShotSearchEngine(examples_path=examples_path)

    def _load_prompt(self, filename: str) -> str:
        path = os.path.join(self.prompt_dir, filename)
        if not os.path.exists(path):
            raise FileNotFoundError(f"ไม่พบไฟล์ prompt ที่: {path}")
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()

    def analyze_trip(self, user_query: str) -> dict:
        system_prompt = self._load_prompt('system_prompt.txt')
        task_template = self._load_prompt('task_template.txt')

        # ดึง fewshot ที่ semantic ใกล้เคียงที่สุด
        fewshot_block = self.fewshot_engine.build_fewshot_block(user_query)

        full_prompt = task_template.replace("{{examples}}", fewshot_block)
        full_prompt = full_prompt.replace("{{user_query}}", user_query)

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": full_prompt}
                ],
                response_format={"type": "json_object"}
            )
            raw_content = completion.choices[0].message.content
            return json.loads(raw_content)

        except Exception as e:
            return {"error": str(e)}


# --- print helper ---
def print_result(result: dict):
    if "error" in result:
        print(f"\n❌ ERROR: {result['error']}")
        return

    print("\n" + "=" * 50)
    output = result.get('output', {})
    print(f"INTENT: {output.get('intent')}")

    pref = output.get('preferences', {})
    print(f"STYLE : {pref.get('style', 'N/A')}")

    print("\nMISSING INFO:")
    for item in output.get('missing_info', []):
        print(f"  - {item}")

    print("\nPLAN:")
    for step in output.get('plan', []):
        print(f"  [{step.get('time') or 'N/A'}] {step.get('location')}")
        print(f"    → {step.get('activity')}")

    print("=" * 50)


# --- รันโปรแกรม ---
if __name__ == "__main__":
    MY_KEY = os.environ.get("GROQ_API_KEY")
    if not MY_KEY:
        raise EnvironmentError("กรุณา set GROQ_API_KEY ใน environment variable")

    analyst = GroqTravelAnalyst(api_key=MY_KEY)
    result = analyst.analyze_trip("อยากพาแฟนไปเดทริมน้ำ")
    print_result(result)