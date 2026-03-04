import os
import requests
from typing import Optional

def get_weather_summary(location_name: str) -> Optional[str]:
    """
    Fetches the weather forecast for a given location using OpenWeatherMap API.
    Returns a summarized string of the weather condition, or None if failed.
    """
    api_key = os.environ.get("OPENWEATHERMAP_API_KEY")
    if not api_key:
        print("Warning: OPENWEATHERMAP_API_KEY environment variable not set. Please set it to fetch weather data.")
        return None

    # Get geo coordinates for the location
    geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={location_name},TH&limit=1&appid={api_key}"
    try:
        geo_response = requests.get(geo_url, timeout=5)
        geo_response.raise_for_status()
        geo_data = geo_response.json()
        
        if not geo_data:
            print(f"Warning: Could not find geographic coordinates for location: {location_name}")
            return None
            
        lat = geo_data[0]['lat']
        lon = geo_data[0]['lon']
        
        # OpenWeatherMap Free API typically provides current weather (or 5-day forecast)
        # We will use current weather as a proxy if forecast isn't available, or the standard 5-day/3-hour forecast API
        weather_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=th"
        
        weather_response = requests.get(weather_url, timeout=5)
        weather_response.raise_for_status()
        weather_data = weather_response.json()
        
        # Extract the forecast for the closest upcoming time (or a summary of the next 24 hours)
        # we'll take the first 4 forecasts (next 12 hours) and summarize them
        forecasts = weather_data.get('list', [])[:4]
        
        if not forecasts:
            return None
            
        temps = [f['main']['temp'] for f in forecasts]
        descriptions = [f['weather'][0]['description'] for f in forecasts]
        
        avg_temp = sum(temps) / len(temps)
        unique_desc = list(set(descriptions))
        
        # Find if any rain is expected in the near future
        rain_probability = max((f.get('pop', 0) for f in forecasts), default=0) * 100
        
        summary = (
            f"[สภาพอากาศคาดการณ์ในพื้นที่ {location_name}]: "
            f"อุณหภูมิเฉลี่ยประมาณ {avg_temp:.1f}°C, "
            f"สภาพอากาศโดยรวม: {', '.join(unique_desc)}. "
            f"โอกาสฝนตกสูงสุด: {rain_probability:.0f}%"
        )
        return summary
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather data for {location_name}: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error in get_weather_summary: {e}")
        return None

if __name__ == "__main__":
    # Test the manual script
    test_location = "เชียงใหม่"
    print(get_weather_summary(test_location))
