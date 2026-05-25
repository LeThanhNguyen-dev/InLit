import json
import sys

def inspect_file(filepath):
    print(f"--- Inspecting {filepath} ---")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(f"Total entries: {len(data)}")
        days = sorted(list(set(entry['day'] for entry in data)))
        print(f"Days present: {days}")
        for day in days:
            day_entries = [entry for entry in data if entry['day'] == day]
            print(f"  Day {day}: {len(day_entries)} words")
            for entry in sorted(day_entries, key=lambda x: x['word']):
                print(f"    - {entry['word']} ({entry['type']})")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    inspect_file(r'g:\InLit\scripts\vocab-batches\vocab_day_006_010.json')
    inspect_file(r'g:\InLit\scripts\vocab-batches\vocab_day_051_055.json')
