import json
import sys

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    with open('../src/data/vocabulary.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    target_days = list(range(11, 26)) + list(range(31, 51)) + list(range(51, 76))
    
    words_by_day = {}
    for entry in data:
        day = entry.get('day')
        if day in target_days:
            if day not in words_by_day:
                words_by_day[day] = []
            words_by_day[day].append(entry)
            
    print(f"Total target days: {len(words_by_day)}")
    for day in sorted(words_by_day.keys()):
        entries = words_by_day[day]
        print(f"Day {day}: {len(entries)} words")
        for e in sorted(entries, key=lambda x: x['word']):
            print(f"  {e['word']} ({e['type']})")

if __name__ == '__main__':
    main()
