import chromadb
from sentence_transformers import SentenceTransformer
from typing import Optional
from pathlib import Path


class TravelRAGRetriever:
    """
    ดึงข้อมูล RAG จาก ChromaDB ที่สร้างไว้ใน scraping pipeline
    """

    def __init__(
        self,
        chroma_path: str = Path(__file__).parent.parent.parent / "chroma_db",
        collection_name: str = "travel_thailand",
        model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
        top_k: int = 5,
    ):
        self.top_k = top_k

        # โหลด Embedding Model (ตัวเดียวกับตอน scrape)
        print("📦 Loading embedding model...")
        self.embed_model = SentenceTransformer(model_name)

        # เชื่อมต่อ ChromaDB
        print(f"🗄️ Connecting to ChromaDB at: {chroma_path}")
        self.client = chromadb.PersistentClient(path=chroma_path)
        self.collection = self.client.get_or_create_collection(collection_name)
        count = self.collection.count()
        if count == 0:
            print(
                f"⚠️ Collection '{collection_name}' is empty. "
                "RAG context will be skipped until data is indexed."
            )
        else:
            print(f"✅ Connected! Collection has {count} chunks")

    def retrieve(self, query: str, top_k: Optional[int] = None) -> list[dict]:
        """
        ค้นหา chunks ที่เกี่ยวข้องกับ query

        Returns:
            list of dicts: [{"text": ..., "source": ..., "distance": ...}]
        """
        k = top_k or self.top_k
        if self.collection.count() == 0:
            return []

        # Embed query
        query_embedding = self.embed_model.encode([query])[0].tolist()

        # Query ChromaDB
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=k,
                include=["documents", "metadatas", "distances"],
            )
        except Exception as e:
            print(f"⚠️ RAG query failed, skipping context: {e}")
            return []

        # จัดรูปแบบผลลัพธ์
        retrieved = []
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        dists = results["distances"][0]

        for doc, meta, dist in zip(docs, metas, dists):
            retrieved.append(
                {
                    "text": doc,
                    "source": meta.get("source", "unknown"),
                    "distance": round(dist, 4),
                }
            )

        return retrieved

    def format_context_block(self, query: str, top_k: Optional[int] = None) -> str:
        """
        ดึงข้อมูลและจัดรูปแบบเป็น context string พร้อมใส่ใน prompt

        Returns:
            str: ข้อความ context สำหรับใส่ใน prompt
        """
        chunks = self.retrieve(query, top_k)
        if not chunks:
            return ""

        lines = ["[ข้อมูลอ้างอิงจากฐานข้อมูลการท่องเที่ยว]"]
        for i, chunk in enumerate(chunks, 1):
            lines.append(f"\n--- อ้างอิงที่ {i} (source: {chunk['source']}) ---")
            lines.append(chunk["text"])

        return "\n".join(lines)
