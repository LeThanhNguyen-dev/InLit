import json
import sys

def list_words():
    filepath = r'g:\InLit\src\data\vocabulary.json'
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    words_by_day = {}
    for entry in data:
        day = entry.get('day')
        if 6 <= day <= 75:
            if day not in words_by_day:
                words_by_day[day] = []
            words_by_day[day].append(entry)
            
    for day in sorted(words_by_day.keys()):
        entries = words_by_day[day]
        print(f"Day {day} ({len(entries)} words):")
        words_str = ", ".join([f"{e['word']}({e['type']})" for e in entries])
        print(f"  {words_str}")

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    list_words()
