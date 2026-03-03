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
        top_k: int = 2
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

    def search(self, user_input: str, use_mmr: bool = True, lambda_param: float = 0.5) -> list:
        query_vec = self.model.encode([user_input], convert_to_numpy=True)
        # Fetch more candidates for MMR to select from
        fetch_k = self.top_k * 3 if use_mmr else self.top_k
        distances, indices = self.index.search(query_vec, fetch_k)

        candidate_indices = indices[0]
        if len(candidate_indices) == 0 or candidate_indices[0] == -1:
            return []

        if not use_mmr or len(candidate_indices) <= self.top_k:
            selected_indices = candidate_indices[:self.top_k]
        else:
            # MMR Implementation
            embeddings = self.model.encode(
                [self.examples[idx]["input"] for idx in candidate_indices], 
                convert_to_numpy=True
            )
            
            selected_indices = []
            unselected_indices = list(range(len(candidate_indices)))
            
            # 1. Start with the most similar one
            first_idx = unselected_indices.pop(0)
            selected_indices.append(first_idx)
            
            # 2. Iteratively pick candidates based on MMR
            while len(selected_indices) < self.top_k and unselected_indices:
                mmr_scores = []
                for i in unselected_indices:
                    # Similarity to query (1 / (1 + distance)) or similar conversion
                    # FAISS IndexFlatL2 returns L2 squared distance
                    sim_to_query = 1.0 / (1.0 + distances[0][i])
                    
                    # Similarity to already selected (max)
                    sim_to_selected = max([
                        np.dot(embeddings[i], embeddings[j]) / 
                        (np.linalg.norm(embeddings[i]) * np.linalg.norm(embeddings[j]))
                        for j in selected_indices
                    ])
                    
                    score = lambda_param * sim_to_query - (1 - lambda_param) * sim_to_selected
                    mmr_scores.append(score)
                
                best_mmr_idx_in_unselected = np.argmax(mmr_scores)
                selected_indices.append(unselected_indices.pop(best_mmr_idx_in_unselected))
            
            selected_indices = [candidate_indices[i] for i in selected_indices]

        results = []
        for rank, idx in enumerate(selected_indices, 1):
            ex = self.examples[idx]
            print(f"  #{rank} {ex['id']} | \"{ex['input'][:40]}...\"")
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