import os
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from groq import Groq
from fewshot_search import FewShotSearchEngine
from history_management import HistoryManagement
from rag_retriever import TravelRAGRetriever

# เพิ่ม path เพื่อให้ import จาก folder อื่นได้
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from evaluation.judge import TripJudge

class GroqTravelAnalyst:
    def __init__(self, api_key: str, chroma_path: str = r"C:\Desktop\ISD\ISD-Intelligence-Trips-Planner\chroma_db"):
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
        # Init History Management (per session)
        self._histories: dict[str, HistoryManagement] = {}
        # Init RAG Retriever
        self.rag_retriever = TravelRAGRetriever(chroma_path=chroma_path)

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

    def _get_completion(self, system_prompt, user_prompt, model="llama-3.3-70b-versatile", temperature=0.1):
        """Helper to call Groq API"""
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        
        completion = self.client.chat.completions.create(
            model=model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=temperature
        )
        
        reply = completion.choices[0].message.content
        
        return reply

    def _get_session_history(self, session_id: str) -> HistoryManagement:
        """คืน HistoryManagement ของ session นั้น (สร้างใหม่ถ้ายังไม่มี)"""
        if session_id not in self._histories:
            self._histories[session_id] = HistoryManagement(api_key=self.api_key, model="llama-3.3-70b-versatile")
        return self._histories[session_id]

    def _build_history_context(self, history: HistoryManagement) -> str:
        """แปลง history เป็น string เพื่อส่งให้ LLM เป็น context"""
        msgs = history.get_history()
        if not msgs:
            return ""
        lines = []
        for msg in msgs:
            if msg["role"] == "user":
                label = "ผู้ใช้"
            elif msg["role"] == "assistant":
                label = "ผู้ช่วย"
            else:  # system (summary)
                label = "[สรุปก่อนหน้า]"
            lines.append(f"{label}: {msg['content']}")
        return "\n".join(lines)

    def clear_session_history(self, session_id: str) -> None:
        """ล้าง history ของ session ที่ระบุ"""
        if session_id in self._histories:
            self._histories[session_id].clear()


    def _get_raw_completion(self, system_prompt, user_prompt, model="llama-3.3-70b-versatile", temperature=0.7):
        """Helper for non-JSON completions (e.g. Planner)"""
        completion = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature
        )
        return completion.choices[0].message.content

    def analyze_trip(self, user_query: str, n_samples: int = 3, verify: bool = True, evaluate: bool = True, session_id: str = "default", rag_top_k: int = 5) -> dict:
        system_prompt = self._load_prompt('system_prompt.txt')
        task_template = self._load_prompt('task_template.txt')
        cot_prompt = self._load_prompt('chain_of_thought.txt', folder="experiment")
        rules = self._load_prompt('rules.txt')
        schema = self._load_prompt('schema.txt')

        # ดึง history ของ session นี้ และสร้าง context string
        history = self._get_session_history(session_id)
        history_context = self._build_history_context(history)

        try:
            # --- Pass 0: Decomposition (Planner) ---
            print("🔍 Retrieving RAG context...")
            rag_context = self.rag.format_context_block(user_query, top_k=rag_top_k)
            print(f"📚 RAG context length: {len(rag_context)} chars")
            print("🗺️ Planning trip strategy (Decomposition)...")
            planner_template = self._load_prompt('planner_template.txt')

            planner_user_prompt = planner_template.format(user_query=user_query)
            # ฉีด history context เข้าไปใน planner prompt (ถ้ามี)
            if history_context:
                planner_user_prompt = (
                    f"[ประวัติการสนทนาก่อนหน้า]\n{history_context}\n\n"
                    f"{planner_user_prompt}"
                )

            trip_strategy = self._get_raw_completion(
                "คุณคือผู้วางกลยุทธ์การท่องเที่ยวที่เชี่ยวชาญ คัดกรองย่านและลำดับความสำคัญ โดยพิจารณาจากประวัติการสนทนาที่แนบมา (ถ้ามี)",
                planner_user_prompt
            )
            print(f"📍 Strategy: {trip_strategy[:100]}...")

            # --- Pass 1: Self-Consistency (Parallel Sampling) ---
            print("🚀 Running Self-Consistency with context...")
            fewshot_block = self.fewshot_engine.build_fewshot_block(user_query)
            
            # เพิ่ม strategy เข้าไปใน user query ของ Generator
            generator_query = f"{user_query}\n\n[TRIP STRATEGY TO FOLLOW]:\n{trip_strategy}"

            context = {
                "examples":   fewshot_block,
                "cot_prompt": cot_prompt,
                "rules":      rules,
                "schema":     schema,
                "user_query": (
    f"{rag_context}\n\n{generator_query}"
    if rag_context else generator_query
),
            }
            full_prompt = task_template.format_map(context)

            print(f"🚀 Running Self-Consistency with {n_samples} samples...")
            with ThreadPoolExecutor(max_workers=n_samples) as executor:
                futures = [
                    executor.submit(self._get_completion, system_prompt, full_prompt, temperature=0.8)
                    for _ in range(n_samples)
                ]
                candidates = [f.result() for f in futures]

            # --- Pass 2: Best Candidate Selection (Judge) ---
            print("⚖️ Judging best candidate...")
            candidate_texts = [f"--- CANDIDATE {i+1} ---\n{c}" for i, c in enumerate(candidates)]
            all_candidates_str = "\n".join(candidate_texts)
            
            judge_template = self._load_prompt('judge_template.txt')
            judge_prompt = judge_template.format(
                n_samples=n_samples,
                user_query=user_query,
                all_candidates_str=all_candidates_str
            )
            
            if rag_context:
                judge_prompt = f"{rag_context}\n\n{judge_prompt}"

            best_result = self._get_completion(
                "คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยว ทำหน้าที่เป็นผู้ตัดสินประเมินแผนการเดินทาง",
                judge_prompt,
                model="llama-3.3-70b-versatile"
            )

            # --- Pass 3: Chain-of-Verification (CoVe) ---
            final_plan = best_result
            if verify:
                print("🛡️ Verifying plan correctness...")
                verification_template = self._load_prompt('verification_template.txt', folder="experiment")
                # Ensure verifier knows the schema
                verify_prompt = verification_template.format(initial_plan=best_result)
                verify_prompt += f"\n\n[JSON SCHEMA TO FOLLOW]:\n{schema}"

                final_plan = self._get_completion(
                    "คุณเป็นผู้ตรวจสอบแผนการท่องเที่ยวที่พิถีพิถันและเข้มงวด ตรวจสอบให้แน่ใจว่าทุกรายละเอียดมีความสมจริง",
                    verify_prompt,
                    model="llama-3.3-70b-versatile"
                )

            # --- Pass 4: LLM-as-a-Judge (Validation & Self-Correction) ---
            if evaluate:
                print("📊 Performing LLM-as-a-Judge evaluation...")
                eval_report = self.evaluator.evaluate_plan(user_query, final_plan)
                
                # --- Pass 5: Self-Correction Loop (One-shot) ---
                if eval_report.get("recommendation") == "REVISION_NEEDED":
                    print("🔄 Self-Correction triggered based on Judge feedback...")
                    correction_template = self._load_prompt('correction_template.txt')
                    correction_prompt = correction_template.format(
                        initial_plan=final_plan,
                        feedback=eval_report.get('feedback')
                    )
                    
                    final_plan = self._get_completion(
                        system_prompt,
                        correction_prompt + f"\n\n[JSON SCHEMA]:\n{schema}",
                        model="llama-3.3-70b-versatile",
                        temperature=0.2
                    )
                    # Re-evaluate after correction
                    print("📊 Re-evaluating corrected plan...")
                    eval_report = self.evaluator.evaluate_plan(user_query, final_plan)

                result = {
                    "plan": json.loads(final_plan),
                    "evaluation": eval_report,
                    "strategy": trip_strategy
                }
                # บันทึก turn นี้เข้า history
                history.add_user_message(user_query)
                history.add_assistant_message(json.dumps(json.loads(final_plan), ensure_ascii=False))
                return result

            parsed_plan = json.loads(final_plan)
            # บันทึก turn นี้เข้า history
            history.add_user_message(user_query)
            history.add_assistant_message(json.dumps(parsed_plan, ensure_ascii=False))
            return {"plan": parsed_plan}

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
    result = analyst.analyze_trip("อยากเที่ยวคาเฟ่ในกรุงเทพมหานคร ภายใน 1 วันออกตั้งแต่ 11:00 อยู่ใกล้ BTS กินมัทฉะร้านดัง ยันคาเฟ่ถ่ายรูป", n_samples=3, verify=True, evaluate=True)
    print_result(result)
