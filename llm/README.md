# 🧠 Wynestia LLM Service

โมดูลส่วน AI ของระบบ Wynestia Trip Planner ทำหน้าที่เป็น **Intelligent Trip Planning Engine** ที่รับคำขอจาก Backend แล้วส่งคืนแผนการท่องเที่ยวที่สมบูรณ์ในรูปแบบ JSON โดยใช้เทคนิค Prompt Engineering หลายชั้นร่วมกับ Retrieval-Augmented Generation (RAG)

---

## 📁 โครงสร้างโฟลเดอร์

```
llm/
├── Dockerfile                  # Container configuration
├── requirements.txt            # Python dependencies
├── chroma_db/                  # ChromaDB vector store (RAG database)
├── prompts/
│   ├── base/                   # Prompt template หลัก
│   │   ├── system_prompt.txt       # Role & Rules สำหรับ LLM
│   │   ├── task_template.txt       # Template ประกอบ Prompt ทั้งหมด
│   │   ├── planner_template.txt    # Template วางกลยุทธ์ทริป
│   │   ├── judge_template.txt      # Template เลือกแผนที่ดีที่สุด
│   │   ├── correction_template.txt # Template แก้ไขแผน (Self-Correction)
│   │   ├── rules.txt               # กฎ Logistics เข้มงวด 20 ข้อ
│   │   └── schema.txt              # JSON Output Schema
│   └── experiment/             # Prompt เทคนิคขั้นสูง
│       ├── chain_of_thought.txt    # CoT 5-step reasoning framework
│       ├── verification_template.txt # Template ตรวจสอบ (CoVe)
│       └── examples.json           # ชุด Few-shot examples (35+ ตัวอย่าง)
└── src/
    ├── service/
    │   ├── api.py                  # FastAPI REST endpoints
    │   ├── call_client.py          # Multi-pass LLM Orchestrator (หัวใจหลัก)
    │   ├── fewshot_search.py       # Semantic Few-shot Search (FAISS + MMR)
    │   ├── rag_retriever.py        # RAG Retriever (ChromaDB)
    │   ├── history_management.py   # Conversation History + Auto-Compression
    │   └── weather_service.py      # OpenWeatherMap Integration
    └── evaluation/
        └── judge.py                # LLM-as-a-Judge Quality Evaluator
```

---

## 🚀 วิธีรันโมดูล LLM Service

### รันด้วย Python โดยตรง

1. สร้าง Virtual Environment และติดตั้ง dependencies:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   pip install -r requirements.txt
   ```

2. ตั้งค่า Environment Variables:
   ```bash
   set GROQ_API_KEY=your_groq_api_key
   set OPENWEATHERMAP_API_KEY=your_weather_api_key
   ```

3. รัน API Server:
   ```bash
   cd src/service
   python api.py
   ```
   API จะรันที่ `http://localhost:8000`

### รันด้วย Docker (จาก Project Root)

```bash
docker-compose up llm-service --build
```

---

## 🌐 API Endpoints

| Method | Endpoint | คำอธิบาย |
|--------|----------|-----------|
| `GET`  | `/` | Health check |
| `POST` | `/analyze` | วิเคราะห์และสร้างแผนทริป (Endpoint หลัก) |
| `DELETE` | `/history/{session_id}` | ล้างประวัติการสนทนาของ Session |
| `GET`  | `/history/{session_id}` | ดูประวัติการสนทนา (Debug) |

### ตัวอย่าง Request (`POST /analyze`)
```json
{
  "query": "อยากเที่ยวคาเฟ่ในกรุงเทพ ใกล้ BTS ภายใน 1 วัน งบ 500 บาท",
  "session_id": "user_abc_session_1",
  "n_samples": 3,
  "verify": true,
  "evaluate": true
}
```

---

## 🏗️ สถาปัตยกรรมและ Data Flow

กระบวนการทำงานภายใน `call_client.py` เป็นแบบ **Multi-Pass Pipeline**:

```
User Query
    │
    ▼
[Pass 0] RAG Retrieval
    │  ค้นหา Context จาก ChromaDB (สถานที่ท่องเที่ยว)
    │
    ▼
[Pass 1] Trip Strategy Planner
    │  "Lock" พื้นที่เป้าหมาย, วางกลยุทธ์ Zones & Categories
    │
    ▼
[Pass X] Weather Integration
    │  ดึง Forecast จาก OpenWeatherMap ตาม Location ที่ Lock
    │
    ▼
[Pass 2] Self-Consistency Sampling
    │  รัน Generator n_samples=3 รอบพร้อมกัน (ThreadPoolExecutor)
    │  เพื่อให้ได้ผลลัพธ์ที่หลากหลายและคัดเลือกได้
    │
    ▼
[Pass 3] LLM-as-a-Judge (Selector)
    │  ใช้ LLM เลือกแผนที่ดีที่สุดจาก n_samples Candidates
    │
    ▼
[Pass 4] Chain-of-Verification (CoVe)
    │  Verifier ตรวจสอบความถูกต้องของ Logic, เวลา, สถานที่จริง
    │
    ▼
[Pass 5] LLM-as-a-Judge (Quality Gate)
    │  ประเมินคะแนน (Accuracy, Relevance, Logistics, Detail, Safety)
    │  ถ้าคะแนน < 7.0 → ส่ง Feedback กลับเพื่อ Self-Correction อัตโนมัติ
    │
    ▼
JSON Response → Backend API
```

---

## 🔧 เทคโนโลยีหลัก

| ส่วนประกอบ | เทคโนโลยี |
|-----------|-----------|
| **API Framework** | FastAPI + Uvicorn |
| **LLM Provider** | Groq API (Model: `openai/gpt-oss-120b`) |
| **Evaluation LLM** | Groq API (Model: `llama-3.3-70b-versatile`) |
| **History Compression** | Groq API (Model: `llama-3.1-8b-instant`) |
| **Semantic Search (RAG)** | ChromaDB + Sentence Transformers |
| **Few-shot Search** | FAISS `IndexFlatL2` + MMR (Maximal Marginal Relevance) |
| **Embedding Model** | `paraphrase-multilingual-MiniLM-L12-v2` |
| **Weather** | OpenWeatherMap API |
| **Concurrency** | Python `ThreadPoolExecutor` |

---

## 🎯 Prompt Engineering Techniques

ระบบนี้ใช้เทคนิค Prompt Engineering ขั้นสูงหลายชั้นซ้อนกัน:

### 1. Role Prompting
กำหนดบทบาทชัดเจนในทุก Prompt เพื่อควบคุม Tone และความเชี่ยวชาญ:
- **"Travel Planner Analyst"** — สร้างแผนทริป (System Prompt)
- **"Trip Strategy Planner"** — วางกลยุทธ์ Zones (Planner Pass)
- **"Verifier"** — ตรวจสอบความถูกต้องทาง Logic (CoVe Pass)
- **"Quality Assurance Judge"** — ประเมินคุณภาพแผน (Evaluation)

### 2. Instruction Prompting + Constraints
ไฟล์ `rules.txt` มีกฎเข้มงวด 20 ข้อ ครอบคลุม:
- **Location Lock** — ห้ามข้ามจังหวัดโดยเด็ดขาด
- **Specific Names Required** — ห้ามใช้ชื่อกว้างๆ ต้องระบุชื่อจริงเสมอ
- **Anti-Hallucination** — ห้ามสร้างสถานที่ขึ้นมาเอง
- **Weather Adaptability** — ต้องใช้ข้อมูลอากาศในการวางแผน

### 3. Semantic Few-shot Prompting
- คลัง `examples.json` มีตัวอย่างมากกว่า **35 ตัวอย่าง** แผนทริปที่ถูกต้อง
- ใช้ **FAISS** สร้าง Vector Index เพื่อค้นหาตัวอย่างที่ **ใกล้เคียงที่สุดเชิงความหมาย** กับ Query
- ใช้ **MMR (Maximal Marginal Relevance)** เพื่อให้ตัวอย่างที่เลือกมีความหลากหลาย (ไม่ซ้ำซาก)

### 4. Chain-of-Thought (CoT)
ไฟล์ `chain_of_thought.txt` บังคับให้ LLM "คิดเป็นขั้นตอน" ก่อนสร้างแผน:
- **Step 0**: Step-Back Analysis (จำแนกประเภททริป: เดท/ครอบครัว/เพื่อน/Solo)
- **Step 1**: วิเคราะห์ข้อมูลที่มี/ขาด (Missing Info)
- **Step 2**: Persona Analysis (อ่าน Lifestyle จาก Signal ใน Query)
- **Step 3**: Budgeting Strategy
- **Step 4**: Logistics Analysis (เส้นทาง, เวลาเดินทาง)
- **Step 4.5**: Anti-Hallucination Check (ตรวจสอบแต่ละสถานที่ก่อน Generate)
- **Step 5**: Integration + Vivid Activity Detail Planning

### 5. Self-Consistency Sampling
รันโมเดลเดียวกัน **หลายรอบพร้อมกัน** (temperature สูง `0.8`) แล้วใช้ LLM Judge คัดเลือกแผนที่ดีที่สุด เพิ่ม Reliability ของผลลัพธ์

### 6. Chain-of-Verification (CoVe)
หลังได้แผนที่ดีที่สุดแล้ว ระบบส่งให้ **Verifier** ตรวจสอบ:
- ตั้งคำถามตรวจสอบสถานที่จริง/เวลาเปิดปิด
- Fact-check ความสมเหตุสมผลของ Logistics
- แก้ไขและส่งคืน JSON ที่ปรับปรุงแล้ว

### 7. LLM-as-a-Judge + Self-Correction Loop
ระบบประเมินแผนด้วยเกณฑ์ 4 ด้าน (**Accuracy, Relevance, Logistics, Detail & Safety**):
- ถ้าคะแนนรวม **≥ 7.0** → `PASS`
- ถ้าคะแนน **< 7.0** → `REVISION_NEEDED` → ส่ง Feedback ให้ LLM แก้ไขอัตโนมัติ 1 รอบ

### 8. Context Injection
ในทุก Generator Pass ระบบฉีด Context หลายชั้นเข้าไปใน Prompt:
- **RAG Context**: ข้อมูลสถานที่จาก ChromaDB (Semantic Search)
- **Weather Context**: พยากรณ์อากาศจริงจาก OpenWeatherMap
- **Strategy Context**: กลยุทธ์ทริปที่วางไว้จาก Planner Pass
- **History Context**: ประวัติการสนทนาก่อนหน้า (สำหรับ Multi-turn)

### 9. Structured Output (JSON Mode)
ทุก Prompt กำหนด `response_format={"type": "json_object"}` และมี JSON Schema กำกับ เพื่อให้ LLM ส่งผลลัพธ์ที่ Parse ได้ทันทีโดยไม่ต้อง Post-process

### 10. Conversation Memory + Auto-Compression
`HistoryManagement` เก็บ History แบบ In-Memory และบีบอัดอัตโนมัติเมื่อมากกว่า **6 messages**:
- สรุป messages เก่า → `[summary_msg]`
- เก็บ 2 messages ล่าสุดไว้ครบ
- ป้องกัน Context Window Overflow

---

## 🔑 Environment Variables

| Variable | คำอธิบาย | จำเป็น |
|----------|-----------|--------|
| `GROQ_API_KEY` | API Key สำหรับ Groq LLM | ✅ บังคับ |
| `OPENWEATHERMAP_API_KEY` | API Key สำหรับข้อมูลอากาศ | ⚠️ แนะนำ |

---

## 📊 สรุปจุดแข็งและจุดที่ควรพัฒนา

### ✅ จุดแข็ง
- **High Reliability**: มีตัวตรวจสอบหลายชั้น (Verifier + Judge) ลด Hallucination ได้มาก
- **Context-Aware**: ฉีดข้อมูลจริง (RAG + Weather) เข้า Prompt ทำให้แผนสมจริง
- **Adaptive Prompting**: ปรับแต่งตาม Persona และสไตล์ของผู้ใช้แต่ละคน

### ⚠️ จุดที่ควรพัฒนา
- **Latency**: Multi-pass Pipeline ใช้เวลานาน (5-6 API calls ต่อ request)
- **Cost**: Self-Consistency Sampling × n_samples เพิ่ม Token Usage
- **Semantic Cache**: ยังไม่มี Cache สำหรับ Query ที่คล้ายกัน ทำให้รัน LLM ซ้ำโดยไม่จำเป็น
