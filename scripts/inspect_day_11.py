import json
import sys

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    with open('../src/data/vocabulary.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    day_11_entries = [e for e in data if e.get('day') == 11]
    print(f"Found {len(day_11_entries)} entries for Day 11")
    for e in day_11_entries[:5]:
        print(json.dumps(e, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()
