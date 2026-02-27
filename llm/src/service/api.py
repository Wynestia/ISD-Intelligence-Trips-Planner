import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

# เพิ่ม path เพื่อให้หา service และ evaluation เจอ
current_dir = os.path.dirname(os.path.abspath(__file__)) # src/service
src_dir = os.path.dirname(current_dir) # src
project_root = os.path.dirname(src_dir) # project root

if src_dir not in sys.path:
    sys.path.append(src_dir)
if current_dir not in sys.path:
    sys.path.append(current_dir)

from call_client import GroqTravelAnalyst

app = FastAPI(
    title="Wynestia Trip Planner API",
    description="API สำหรับวางแผนการท่องเที่ยวอัตโนมัติด้วย LLM (Groq)",
    version="1.0.0"
)

# เพิ่ม CORS เพื่อให้ Web App (Frontend) เรียกใช้ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # ปรับเปลี่ยนเป็น domain ของ frontend ในโปรดักชั่น
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global analyst instance
analyst = None

@app.on_event("startup")
async def startup_event():
    global analyst
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("❌ Warning: GROQ_API_KEY not found in environment variables.")
    else:
        try:
            analyst = GroqTravelAnalyst(api_key=api_key)
            print("✅ GroqTravelAnalyst initialized successfully.")
        except Exception as e:
            print(f"❌ Failed to initialize GroqTravelAnalyst: {e}")

class TripPlanRequest(BaseModel):
    query: str
    session_id: str = "default"
    n_samples: int = 3
    verify: bool = True
    evaluate: bool = True

@app.get("/")
async def health_check():
    return {
        "status": "online",
        "service": "Wynestia Trip Planner API",
        "analyst_initialized": analyst is not None,
        "debug_mode": analyst.debug_mode if analyst else False
    }

@app.post("/debug")
async def toggle_debug(enabled: bool):
    if analyst is None:
        raise HTTPException(status_code=500, detail="Service not initialized")
    analyst.set_debug_mode(enabled)
    return {"debug_mode": enabled}


@app.post("/analyze")
async def analyze_trip(request: TripPlanRequest):
    if analyst is None:
        raise HTTPException(
            status_code=500, 
            detail="Service is not properly initialized. Please check GROQ_API_KEY."
        )
    
    try:
        # เรียกใช้ service
        result = analyst.analyze_trip(
            user_query=request.query,
            n_samples=request.n_samples,
            verify=request.verify,
            evaluate=request.evaluate,
            session_id=request.session_id
        )
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/history/{session_id}")
async def clear_history(session_id: str):
    """ล้าง conversation history ของ session ที่ระบุ"""
    if analyst is None:
        raise HTTPException(status_code=500, detail="Service not initialized")
    analyst.clear_session_history(session_id)
    return {"message": f"History cleared for session '{session_id}'"}


@app.get("/history/{session_id}")
async def get_history(session_id: str):
    """ดู conversation history ของ session (สำหรับ debug)"""
    if analyst is None:
        raise HTTPException(status_code=500, detail="Service not initialized")
    history = analyst._get_session_history(session_id)
    return {
        "session_id": session_id,
        "message_count": len(history),
        "messages": history.get_history()
    }

if __name__ == "__main__":
    # รันด้วย uvicorn
    # สามารถรันผ่าน terminal ด้วย: uvicorn src.api:app --reload
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
