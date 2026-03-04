import os
import json
from call_client import GroqTravelAnalyst, print_result

if __name__ == "__main__":
    MY_KEY = os.environ.get("GROQ_API_KEY")
    if not MY_KEY:
        print("Error: GROQ_API_KEY is not set.")
    else:
        try:
            analyst = GroqTravelAnalyst(api_key=MY_KEY)
            print("\n" + "="*50)
            print("🚀 Testing Weather Integration")
            print("="*50)
            # Use 1 sample and false evaluate to speed up testing
            result = analyst.analyze_trip("อยากเที่ยวทะเลพัทยา ชลบุรี แบบชิลๆ 1 วัน", n_samples=1, verify=False, evaluate=False)
            print_result(result)
            
            # check if weather tip is generated
            plan_data = result.get('plan', {})
            tips = plan_data.get('output', {}).get('tips', [])
            has_weather = any("[สภาพอากาศ]" in tip for tip in tips)
            
            if has_weather:
                print("\n✅ SUCCESS: Weather tip generated!")
            else:
                print("\n❌ FAILED: No weather tip found.")
        except Exception as e:
            print(f"\n❌ Error during testing: {e}")
