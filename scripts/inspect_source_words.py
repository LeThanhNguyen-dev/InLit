import json
import sys

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    with open('../src/data/vocabulary.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    ranges = [
        (11, 15, "Business Communication"),
        (16, 20, "HR & Employment"),
        (21, 25, "Travel & Transportation"),
        (31, 35, "Sales & Retail"),
        (36, 40, "Finance & Banking"),
        (41, 45, "Technology & IT"),
        (46, 50, "Shipping & Logistics"),
        (51, 55, "Manufacturing & Production"),
        (56, 60, "Hospitality & Dining"),
        (61, 65, "Real Estate & Facilities"),
        (66, 70, "Events & Conferences"),
        (71, 75, "Media & Advertising")
    ]
    
    for start, end, topic in ranges:
        days = range(start, end + 1)
        words = [e for e in data if e.get('day') in days]
        print(f"=== Days {start}-{end}: {topic} (Total: {len(words)} words) ===")
        # Print first 5 and last 5 words
        sorted_words = sorted(words, key=lambda x: (x.get('day'), x.get('word')))
        for w in sorted_words[:5]:
            print(f"  Day {w.get('day')}: {w.get('word')} ({w.get('type')}) - {w.get('meaning')}")
        if len(sorted_words) > 10:
            print("  ...")
        for w in sorted_words[-5:]:
            print(f"  Day {w.get('day')}: {w.get('word')} ({w.get('type')}) - {w.get('meaning')}")
        print()

if __name__ == "__main__":
    main()
