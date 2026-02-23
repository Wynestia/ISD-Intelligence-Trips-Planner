import requests
from bs4 import BeautifulSoup
import json
import re

def scrape_thairath(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    
    script_tags = soup.find_all("script", type="application/ld+json")
    article_body = ""
    for script in script_tags:
        try:
            data = json.loads(script.string)
            if data.get("articleBody"):
                article_body = data["articleBody"]
                break
        except:
            continue
    
    if not article_body:
        return []
    
    # ลบขยะ เช่น "ภาพจาก iStock" และ whitespace เกิน
    article_body = re.sub(r'ภาพจาก\s?\S+', '', article_body)
    article_body = re.sub(r'\s+', ' ', article_body).strip()
    
    results = []
    
    # แยกด้วย pattern "ตัวเลข. ทายนิสัย"
    sections = re.split(r'(\d+\.\s*ทายนิสัย[^0-9]+?)(?=\d+\.\s*ทายนิสัย|$)', article_body)
    
    for section in sections:
        section = section.strip()
        if not section or not re.match(r'\d+\.', section):
            continue
        
        # แยก title (ถึงคำว่า "คน" แรก) กับ details
        match = re.match(r'(\d+\.\s*ทายนิสัย\S+)\s*(.*)', section, re.DOTALL)
        if match:
            title = match.group(1).strip()
            details = match.group(2).strip()
        else:
            title = section[:50]
            details = section
        
        results.append({
            "title": title,
            "details": details,
            "url": url
        })
    
    return results
 

# เรียกใช้
data1 = scrape_thairath("https://www.thairath.co.th/lifestyle/life/2888711")
for item in data1:
    print(item["title"])
    print(item["details"])
    print("---")

def scrape_page2(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, "html.parser")
    
    results = []
    
    # แบบที่ 1: หัวข้อใน p font-size:24px + คำอธิบายใน has-medium-font-size
    title_tags = soup.find_all("p", style=lambda s: s and "font-size:24px" in s)
    for title_tag in title_tags:
        title = title_tag.get_text(strip=True)
        if not title:
            continue
        
        description = ""
        for sibling in title_tag.find_next_siblings():
            if sibling.name == "p" and "has-medium-font-size" in sibling.get("class", []):
                description = sibling.get_text(strip=True)
                break
            if sibling.name == "p" and sibling.get("style") and "font-size:24px" in sibling.get("style"):
                break
        
        results.append({
            "title": title,
            "details": description,
            "url": url
        })
    
    # แบบที่ 2: หัวข้อใน <strong> ภายใน has-medium-font-size
    medium_tags = soup.find_all("p", class_="has-medium-font-size")
    for p in medium_tags:
        strong = p.find("strong")
        if not strong:
            continue
        
        title = strong.get_text(strip=True)
        # ดึงข้อความที่เหลือหลัง strong เป็น details
        full_text = p.get_text(strip=True)
        details = full_text.replace(title, "", 1).strip()
        
        if title and details:
            results.append({
                "title": title,
                "details": details,
                "url": url
            })
    
    return results

# เรียกใช้
data2 = scrape_page2("https://daysplustravel.co.th/take-a-trip/13-%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B8%AA%E0%B9%84%E0%B8%95%E0%B8%A5%E0%B9%8C%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%97%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A2/")
for item in data2:
    print(item["title"])
    print(item["details"])
    print("---")

    import re

raw_text = """1. สาย Slow Life & Minimalist
ไลฟ์สไตล์: ชอบตื่นสายๆ จิบกาแฟร้านที่ตกแต่งคุมโทน เดินเล่นถนนคนเดิน มองวิวทุ่งนาหรือภูเขาแบบไม่ต้องรีบไปไหน เชียงใหม่ (โซนแม่กำปอง/นิมมาน): คาเฟ่เยอะจนแวะไม่ครบ บรรยากาศชิลล์ระดับสิบ, น่าน: สโลว์ไลฟ์ของจริง ถนนสวย วัดงาม และความเงียบสงบที่หาไม่ได้ในเมืองกรุง, แม่ฮ่องสอน (ปาย): นั่งโง่ๆ ดูหมอก สัมผัสอากาศเย็นและวิถีชีวิตฮิปปี้เบาๆ

2. สายหรูหรา (Luxury & Chill)
ไลฟ์สไตล์: เน้นพัก Pool Villa ถ่ายรูปชุดว่ายน้ำตัวละหมื่น กิน Dinner บนดาดฟ้า หรือล่องเรือยอร์ชชมพระอาทิตย์ตก, ภูเก็ต: ยืนหนึ่งเรื่องที่พักระดับ World Class และ Beach Club สุดเหวี่ยง, ประจวบคีรีขันธ์ (หัวหิน): คลาสสิก มีระดับ เดินทางง่ายจากกรุงเทพฯ และมีโรงแรมหรูติดทะเลเพียบ, สุราษฎร์ธานี (เกาะสมุย): ทะเลสวยน้ำใส พร้อมบริการระดับไฮเอนด์ที่ทำให้คุณรู้สึกเหมือนเป็นเจ้าหญิง

3. สายลุย ไม่คุยให้เสียเวลา (Adventurer)
ไลฟ์สไตล์: เหงื่อไม่ออกนอนไม่หลับ ชอบปีนเขา เดินป่า กางเต็นท์ หรือดำน้ำลึก, กาญจนบุรี: ล่องแพ ปีนเขาสันหนอกวัว หรือสำรวจถ้ำและน้ำตก, กระบี่: สวรรค์ของคนชอบปีนผาและดำน้ำดูปะการังน้ำลึก (Scuba), เลย (ภูกระดึง): พิสูจน์รักแท้ด้วยการเดินขึ้นเขา 9 กิโลเมตร เพื่อไปดูพระอาทิตย์ขึ้นที่ผานกแอ่น

4. สายมูเตลู (The Believer)
ไลฟ์สไตล์: ไปไหนก็ได้ขอให้ได้ไหว้พระ ขอพร เสริมดวง เน้นวัดดัง เกจิเด่น หรือสถานที่ศักดิ์สิทธิ์, อุดรธานี / บึงกาฬ: ไปคำชะโนดต่อด้วยถ้ำนาคา ขอโชคลาภและความปังจากพญานาค, ฉะเชิงเทรา: ไหว้หลวงพ่อโสธรและพระพิฆเนศองค์ใหญ่ที่สุดในโลก, นครศรีธรรมราช: ไปหา "ไอ้ไข่" วัดเจดีย์ และไหว้พระบรมธาตุเมืองคอน

5. สายกินแหลก (The Foodie)
ไลฟ์สไตล์: แพลนเที่ยวไม่มี มีแต่แพลนร้านอาหาร Street Food ต้องโดน มิชลินไกด์ต้องตามเก็บ, กรุงเทพฯ: ครบจบที่เดียวตั้งแต่รถเข็นข้างทางยัน Fine Dining ในเยาวราชหรือบรรทัดทอง, สงขลา (หาดใหญ่): สวรรค์ของคนรักติ่มซำ ไก่ทอดหาดใหญ่ และอาหารใต้รสจัดจ้าน, ตรัง: เมืองคนกิน ดุเดือดตั้งแต่หมูย่างเมืองตรังยามเช้าไปจนถึงซีฟู้ดสดๆ"""  # วางข้อความทั้งหมดตรงนี้

def parse_plain_text(text, source_url="manual_input"):
    results = []
    
    # แยกแต่ละหัวข้อด้วย pattern "ตัวเลข."
    sections = re.split(r'(?=\d+\.)', text.strip())
    
    for section in sections:
        section = section.strip()
        if not section:
            continue
        
        # บรรทัดแรกคือ title ที่เหลือคือ details
        lines = section.split('\n', 1)
        title = lines[0].strip()
        details = lines[1].strip() if len(lines) > 1 else ""
        
        
        if title and details:
            results.append({
                "title": title,
                "details": details,
                "url": source_url
            })
    
    return results

data3 = parse_plain_text(raw_text)

# ดูผลลัพธ์
for item in data3:
    print(item['title'])
    print(item['details'])
    print("---")

import re

def clean_text(text):
    text = re.sub(r'30 เส้นทางเดินป่าเมืองไทย.*?!', '', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s+', ' ', text)        # ลบ whitespace เกิน
    text = re.sub(r'\n+', '\n', text)       # ลบบรรทัดว่างซ้ำ
    text = text.strip()
    return text

# ทำความสะอาดข้อมูลที่ scrape มา
for item in data1:
    item["details"] = clean_text(item["details"])
    full_text = f" {item['title']}, {item['details']}"
for item in data2:
    item["details"] = clean_text(item["details"])
    full_text = f" {item['title']}, {item['details']}"
for item in data3:
    item["details"] = clean_text(item["details"])
    full_text = f" {item['title']}, {item['details']}"

def split_text(text, chunk_size=500, chunk_overlap=50):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - chunk_overlap
    return chunks

chunks = []

for dataset in [data1, data2, data3]:
    for item in dataset:
        # text ใช้แค่ details ไม่เอา title ซ้ำ
        details_text = clean_text(item['details'])
        
        if len(details_text.strip()) < 20:
            continue
        
        split_texts = split_text(details_text)
        for chunk in split_texts:
            if len(chunk.strip()) < 30:
                continue
            chunks.append({
                "text": f"หัวข้อ: {item['title']}\nรายละเอียด: {chunk}",  # จัดรูปแบบชัดเจน
                "source": item["url"],
            })

print(f"chunks ทั้งหมด: {len(chunks)}")
for i, chunk in enumerate(chunks):
    print(f"--- Chunk {i} ---")
    print(f"Text: {chunk['text']}")
    print(f"Source: {chunk['source']}")
    print()

from sentence_transformers import SentenceTransformer

model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

texts = [c["text"] for c in chunks]
embeddings = model.encode(texts, show_progress_bar=True, batch_size=16)

print(f"จำนวน chunks: {len(texts)}")
print(f"Embeddings shape: {embeddings.shape}")

import chromadb

# บันทึกลง disk โฟลเดอร์ชื่อ chroma_db
client = chromadb.PersistentClient(path="./chroma_db")

try:
    client.delete_collection("travel_thailand")
except:
    pass

collection = client.create_collection("travel_thailand")

collection.add(
    documents=[c["text"] for c in chunks],
    embeddings=embeddings.tolist(),
    metadatas=[{"source": c["source"]} for c in chunks],
    ids=[f"chunk_{i}" for i in range(len(chunks))]
)

print(f"บันทึกลง Vector DB สำเร็จ: {collection.count()} chunks")

# # โหลดกลับมาใช้ครั้งหน้า
# client = chromadb.PersistentClient(path="./chroma_db")
# collection = client.get_collection("travel_thailand")
# print(collection.count())