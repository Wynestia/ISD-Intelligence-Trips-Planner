import os
import json
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from groq import Groq
from fewshot_search import FewShotSearchEngine
from history_management import HistoryManagement
from rag_retriever import TravelRAGRetriever
from weather_service import get_weather_summary

# เพิ่ม path เพื่อให้ import จาก folder อื่นได้
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from evaluation.judge import TripJudge


def _extract_json_payload(text: str) -> str | None:
    """Extract first balanced JSON object/array from a text blob."""
    if not text:
        return None

    start = -1
    opening = ""
    for i, ch in enumerate(text):
        if ch == "{":
            start = i
            opening = "{"
            break
        if ch == "[":
            start = i
            opening = "["
            break

    if start == -1:
        return None

    closing = "}" if opening == "{" else "]"
    depth = 0
    in_string = False
    escaped = False

    for i in range(start, len(text)):
        ch = text[i]

        if escaped:
            escaped = False
            continue

        if ch == "\\":
            escaped = True
            continue

        if ch == '"':
            in_string = not in_string
            continue

        if in_string:
            continue

        if ch == opening:
            depth += 1
        elif ch == closing:
            depth -= 1
            if depth == 0:
                return text[start:i + 1]

    return None


class GroqTravelAnalyst:
    def __init__(self, api_key: str, chroma_path: str = None):
        self.client = Groq(api_key=api_key)
        self.api_key = api_key
        self.debug_mode = False
        self.base_dir = os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        )
        if chroma_path is None:
            project_root = os.path.dirname(self.base_dir)
            chroma_path = os.path.join(project_root, "chroma_db")
        
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

    def set_debug_mode(self, enabled: bool) -> None:
        self.debug_mode = bool(enabled)

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

    def _get_completion(self, system_prompt, user_prompt, model="openai/gpt-oss-120b", temperature=0.1):
        """Helper to call Groq API with JSON fallback/recovery."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        try:
            completion = self.client.chat.completions.create(
                model=model,
                messages=messages,
                response_format={"type": "json_object"},
                temperature=temperature
            )
            reply = completion.choices[0].message.content
            return self._normalize_json_reply(reply)
        except Exception as strict_error:
            print(f"⚠️ Strict JSON generation failed, retrying with fallback: {strict_error}")

            fallback_system = (
                f"{system_prompt}\n\n"
                "IMPORTANT: Return only one valid JSON object. "
                "No markdown, no backticks, no explanation."
            )
            fallback_completion = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": fallback_system},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=max(0.1, min(temperature, 0.3))
            )
            fallback_reply = fallback_completion.choices[0].message.content
            return self._normalize_json_reply(fallback_reply)

    def _normalize_json_reply(self, reply: str) -> str:
        """Normalize model reply into a valid JSON string."""
        if not reply or not isinstance(reply, str):
            raise ValueError("Model returned an empty response")

        cleaned = reply.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.replace("```json", "").replace("```", "").strip()

        # 1) Direct parse
        try:
            parsed = json.loads(cleaned)
            if isinstance(parsed, str):
                parsed = json.loads(parsed)
            return json.dumps(parsed, ensure_ascii=False)
        except Exception:
            pass

        # 2) Extract payload from surrounding text and parse
        payload = _extract_json_payload(cleaned)
        if payload:
            parsed = json.loads(payload)
            if isinstance(parsed, str):
                parsed = json.loads(parsed)
            return json.dumps(parsed, ensure_ascii=False)

        preview = cleaned[:300].replace("\n", " ")
        raise ValueError(f"Unable to parse JSON from model response: {preview}")

    def _get_session_history(self, session_id: str) -> HistoryManagement:
        """คืน HistoryManagement ของ session นั้น (สร้างใหม่ถ้ายังไม่มี)"""
        if session_id not in self._histories:
            self._histories[session_id] = HistoryManagement(api_key=self.api_key, model="openai/gpt-oss-120b")
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

    def _get_raw_completion(self, system_prompt, user_prompt, model="openai/gpt-oss-120b", temperature=0.7):
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
            rag_context = self.rag_retriever.format_context_block(user_query, top_k=rag_top_k)
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

            # --- Pass X: Extract Location & Fetch Weather ---
            print("🌤️ Fetching weather data...")
            import re
            loc_match = re.search(r'พื้นที่ที่ lock ไว้.*?[:：]\s*(?:\[)?([^\]\n]+)(?:\])?', trip_strategy)
            weather_context = ""
            if loc_match:
                locked_loc = loc_match.group(1).strip()
                print(f"   => Found location: {locked_loc}")
                summary = get_weather_summary(locked_loc)
                if summary:
                    weather_context = f"\n{summary}\n"
                    print(f"   => {summary}")
                else:
                    print("   => Could not fetch weather summary.")
            else:
                print("   => Could not extract locked location from strategy.")

            # --- Pass 1: Self-Consistency (Parallel Sampling) ---
            print("🚀 Running Self-Consistency with context...")
            fewshot_block = self.fewshot_engine.build_fewshot_block(user_query)
            
            # เพิ่ม strategy และ weather เข้าไปใน user query ของ Generator
            combined_query = f"{user_query}\n\n[TRIP STRATEGY TO FOLLOW]:\n{trip_strategy}\n{weather_context}"

            context = {
                "examples":   fewshot_block,
                "cot_prompt": cot_prompt,
                "rules":      rules,
                "schema":     schema,
                "user_query": combined_query,
            }
            full_prompt = task_template.format_map(context)

            print(f"🚀 Running Self-Consistency with {n_samples} samples...")
            with ThreadPoolExecutor(max_workers=n_samples) as executor:
                futures = [
                    executor.submit(self._get_completion, system_prompt, full_prompt, temperature=0.8)
                    for _ in range(n_samples)
                ]
                candidates = []
                for future in as_completed(futures):
                    try:
                        candidates.append(future.result())
                    except Exception as sample_error:
                        print(f"⚠️ Candidate generation failed: {sample_error}")

            if not candidates:
                raise RuntimeError("All candidate generations failed. Please try again with a simpler request.")

            # --- Pass 2: Best Candidate Selection (Judge) ---
            print("⚖️ Judging best candidate...")
            candidate_texts = [f"--- CANDIDATE {i+1} ---\n{c}" for i, c in enumerate(candidates)]
            all_candidates_str = "\n".join(candidate_texts)

            judge_template = self._load_prompt('judge_template.txt')
            judge_prompt = judge_template.format(
                n_samples=len(candidates),
                user_query=user_query,
                all_candidates_str=all_candidates_str
            )
            
            if rag_context:
                judge_prompt = f"{rag_context}\n\n{judge_prompt}"

            if len(candidates) == 1:
                best_result = candidates[0]
            else:
                best_result = self._get_completion(
                    "คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยว ทำหน้าที่เป็นผู้ตัดสินประเมินแผนการเดินทาง",
                    judge_prompt,
                    model="openai/gpt-oss-120b"
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
                    model="openai/gpt-oss-120b"
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
                        model="openai/gpt-oss-120b",
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
    

# # --- รันโปรแกรม ---
# if __name__ == "__main__":
#     MY_KEY = os.environ.get("GROQ_API_KEY")
#     if not MY_KEY:
#         raise EnvironmentError("กรุณา set GROQ_API_KEY ใน environment variable")

#     analyst = GroqTravelAnalyst(api_key=MY_KEY)
#     result = analyst.analyze_trip("อยากเที่ยวคาเฟ่ในกรุงเทพมหานคร ภายใน 1 วันออกตั้งแต่ 11:00 อยู่ใกล้ BTS กินมัทฉะร้านดัง ยันคาเฟ่ถ่ายรูป", n_samples=3, verify=True, evaluate=True)
#     print_result(result)
