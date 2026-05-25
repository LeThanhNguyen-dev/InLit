import json
import sys

def inspect_source():
    filepath = r'g:\InLit\src\data\vocabulary.json'
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"Total entries: {len(data)}")
        days = [6, 10, 11, 15, 16, 20, 21, 25, 31, 35, 36, 40, 41, 45, 46, 50, 51, 55, 56, 60, 61, 65, 66, 70, 71, 75]
        for day in sorted(list(set(days))):
            day_entries = [entry for entry in data if entry['day'] == day]
            print(f"Day {day}: {len(day_entries)} entries")
            if day_entries:
                print(f"  First 3 entries:")
                for e in day_entries[:3]:
                    print(f"    - {e['word']} ({e['type']}): {e.get('meaning')} | {e.get('example')}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    inspect_source()
