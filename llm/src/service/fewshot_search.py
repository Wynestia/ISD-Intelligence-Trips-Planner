import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss


class FewShotSearchEngine:
    def __init__(
        self,
        examples_path: str,
        model_name: str = "paraphrase-multilingual-MiniLM-L12-v2",
        top_k: int = 3
    ):
        self.top_k = top_k
        self.examples = self._load_examples(examples_path)
        self.model = SentenceTransformer(model_name)
        self.index = self._build_index()

    def _load_examples(self, path: str) -> list:
        if not os.path.exists(path):
            raise FileNotFoundError(f"ไม่พบไฟล์ examples ที่: {path}")
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"✅ โหลด examples สำเร็จ — {len(data)} examples")
        return data

    def _build_index(self) -> faiss.IndexFlatL2:
        inputs = [ex["input"] for ex in self.examples]
        embeddings = self.model.encode(inputs, convert_to_numpy=True)
        dim = embeddings.shape[1]
        index = faiss.IndexFlatL2(dim)
        index.add(embeddings)
        print(f"✅ สร้าง FAISS index สำเร็จ — dim={dim}")
        return index

    def search(self, user_input: str) -> list:
        query_vec = self.model.encode([user_input], convert_to_numpy=True)
        distances, indices = self.index.search(query_vec, self.top_k)

        results = []
        for rank, (idx, dist) in enumerate(zip(indices[0], distances[0]), 1):
            ex = self.examples[idx]
            print(f"  #{rank} {ex['id']} | distance={dist:.4f} | \"{ex['input'][:40]}...\"")
            results.append(ex)

        return results

    def _format_example(self, example: dict) -> str:
        out = example["output"]
        pref = out.get("preferences", {})

        # PREFERENCES
        target = pref.get("target_group") or "N/A"
        budget = pref.get("budget") or "N/A"
        style = pref.get("style") or "N/A"

        # MISSING_INFO
        missing_text = "\n".join([
            f"- {m}" for m in out.get("missing_info", [])
        ])

        # PLAN
        plan_text = "\n".join([
            f"- {p.get('time') or 'N/A'} | {p.get('location')}: {p.get('activity')}"
            for p in out.get("plan", [])
        ])

        # REASONING
        reasoning_text = "\n".join([
            f"- {r}" for r in out.get("reasoning", [])
        ])

        # TIPS
        tips_text = "\n".join([
            f"- {t}" for t in out.get("tips", [])
        ])

        return f"""INTENT:
{out.get('intent')}

PREFERENCES:
- กลุ่มเป้าหมาย: {target}
- งบประมาณ: {budget}
- สไตล์: {style}

MISSING_INFO:
{missing_text}

PLAN:
{plan_text}

REASONING:
{reasoning_text}

TIPS:
{tips_text}"""

    def build_fewshot_block(self, user_input: str) -> str:
        print(f"\n🔍 Semantic Search: \"{user_input}\"")
        matched = self.search(user_input)

        blocks = []
        for i, ex in enumerate(matched, 1):
            blocks.append(f"""### EXAMPLE {i}

INPUT:
"{ex['input']}"

OUTPUT:
{self._format_example(ex)}""")

        return "\n\n---\n\n".join(blocks)