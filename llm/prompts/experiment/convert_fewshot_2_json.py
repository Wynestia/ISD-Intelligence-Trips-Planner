import json
import os

experiment_dir = os.path.dirname(os.path.abspath(__file__))

file_order = (
    ['fewshot_header.txt'] +
    [f'fewshot{i}.txt' for i in range(1, 24)] +
    ['fewsoht_tail.txt']
)

all_text = []
for filename in file_order:
    path = os.path.join(experiment_dir, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            all_text.append(f.read().strip())
        print(f"✅ โหลด {filename}")

full_text = "\n".join(all_text)

# ใช้ JSONDecoder ดึง object ทีละตัวแทน regex
examples = []
decoder = json.JSONDecoder()
i = 0

while i < len(full_text):
    # ข้าม whitespace
    while i < len(full_text) and full_text[i] in ' \t\n\r,':
        i += 1

    if i >= len(full_text):
        break

    # ข้าม [ และ ]
    if full_text[i] in '[]':
        i += 1
        continue

    # ถ้าเจอ { ให้ลอง parse
    if full_text[i] == '{':
        try:
            obj, end_idx = decoder.raw_decode(full_text, i)
            if all(k in obj for k in ["id", "input", "metadata", "output"]):
                examples.append(obj)
                print(f"✅ parse {obj.get('id')} สำเร็จ")
            else:
                print(f"⚠️  object ที่ i={i} ไม่ครบ field: {list(obj.keys())}")
            i = end_idx
        except json.JSONDecodeError as e:
            print(f"❌ parse ไม่ได้ที่ i={i}: {e}")
            i += 1
    else:
        i += 1

# บันทึก
if examples:
    output_path = os.path.join(experiment_dir, 'examples.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(examples, f, ensure_ascii=False, indent=2)
    print(f"\n✅ สร้าง examples.json สำเร็จ — {len(examples)} examples")
else:
    print("\n❌ ไม่พบ example ที่ valid เลย")