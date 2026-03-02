import os
import sys
import json

# Add src to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(project_root, "llm", "src", "service"))

from call_client import GroqTravelAnalyst

def test_full_analysis():
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("❌ Skip test: GROQ_API_KEY not found")
        return

    print("--- Starting Full Analysis Flow Test ---")
    analyst = GroqTravelAnalyst(api_key=api_key)
    
    query = "มีเงิน 2000 เที่ยวกรุงเทพคนเดียว เน้นถ่ายรูปสวยๆ และคาเฟ่ชิคๆ"
    result = analyst.analyze_trip(query, n_samples=2, verify=True, evaluate=True)
    
    print("\n[RESULT]")
    if "error" in result:
        print(f"❌ Test Failed: {result['error']}")
        return

    # Check for new features
    has_strategy = "strategy" in result
    has_plan = "plan" in result
    has_eval = "evaluation" in result
    
    print(f"✅ Has Strategy: {has_strategy}")
    print(f"✅ Has Plan: {has_plan}")
    print(f"✅ Has Evaluation: {has_eval}")
    
    if has_strategy:
        print(f"\n[STRATEGY SAMPLE]\n{result['strategy'][:200]}...")
        
    if has_eval:
        print(f"\n[EVALUATION REPORT]\nScore: {result['evaluation'].get('total_score')}")
        print(f"Recommendation: {result['evaluation'].get('recommendation')}")

    print("\n--- Test Completed Successfully ---")

if __name__ == "__main__":
    test_full_analysis()
