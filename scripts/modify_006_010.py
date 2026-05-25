import json
import os

filepath = r'g:\InLit\scripts\vocab-batches\vocab_day_006_010.json'
with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define replacements
replacements = {
    ("address", "verb"): {
        "id": "audiovisual-adjective",
        "word": "audiovisual",
        "baseWord": "audiovisual",
        "type": "adjective",
        "meaning": "(thuộc) nghe nhìn",
        "pronunciation": "/ˌɔːdiəʊˈvɪʒuəl/",
        "topic": "Meetings & Scheduling",
        "frequency": "medium",
        "level": "medium",
        "partTags": ["Part 5", "Part 7"],
        "example": "The conference room is equipped with advanced audiovisual equipment.",
        "exampleVi": "Phòng hội nghị được trang bị các thiết bị nghe nhìn tiên tiến.",
        "collocations": ["audiovisual equipment", "audiovisual aid", "audiovisual presentation"],
        "synonyms": ["multimedia"],
        "wordFamily": ["audio", "visual"],
        "day": 9
    },
    ("briefing", "noun"): {
        "id": "timeframe-noun",
        "word": "timeframe",
        "baseWord": "timeframe",
        "type": "noun",
        "meaning": "khung thời gian, khoảng thời gian",
        "pronunciation": "/ˈtaɪmfreɪm/",
        "topic": "Meetings & Scheduling",
        "frequency": "medium",
        "level": "medium",
        "partTags": ["Part 3", "Part 5", "Part 7"],
        "example": "We need to complete the project within a tight timeframe.",
        "exampleVi": "Chúng tôi cần hoàn thành dự án trong một khung thời gian hạn hẹp.",
        "collocations": ["tight timeframe", "project timeframe", "within the timeframe"],
        "synonyms": ["period", "duration", "timeline"],
        "wordFamily": ["time", "frame"],
        "day": 9
    },
    ("resolution", "noun"): {
        "id": "bulletin-noun",
        "word": "bulletin",
        "baseWord": "bulletin",
        "type": "noun",
        "meaning": "bản tin, thông báo ngắn",
        "pronunciation": "/ˈbʊlətɪn/",
        "topic": "Meetings & Scheduling",
        "frequency": "medium",
        "level": "medium",
        "partTags": ["Part 5", "Part 6", "Part 7"],
        "example": "Please read the weekly bulletin for updates on scheduling.",
        "exampleVi": "Vui lòng đọc bản tin hàng tuần để biết thông tin cập nhật về lịch trình.",
        "collocations": ["weekly bulletin", "bulletin board", "news bulletin"],
        "synonyms": ["newsletter", "announcement", "notice"],
        "wordFamily": [],
        "day": 9
    },
    ("accommodate", "verb"): {
        "id": "hosting-noun",
        "word": "hosting",
        "baseWord": "host",
        "type": "noun",
        "meaning": "việc đăng cai, việc tổ chức",
        "pronunciation": "/ˈhoʊstɪŋ/",
        "topic": "Meetings & Scheduling",
        "frequency": "medium",
        "level": "medium",
        "partTags": ["Part 5", "Part 7"],
        "example": "Hosting the annual conference requires a lot of preparation.",
        "exampleVi": "Việc tổ chức hội nghị thường niên đòi hỏi nhiều sự chuẩn bị.",
        "collocations": ["hosting duties", "hosting event", "hosting website"],
        "synonyms": ["organizing", "presenting"],
        "wordFamily": ["host", "hostess"],
        "day": 10
    },
    ("complimentary", "adjective"): {
        "id": "customary-adjective",
        "word": "customary",
        "baseWord": "custom",
        "type": "adjective",
        "meaning": "theo phong tục, thông thường",
        "pronunciation": "/ˈkʌstəməri/",
        "topic": "Meetings & Scheduling",
        "frequency": "low",
        "level": "hard",
        "partTags": ["Part 5", "Part 7"],
        "example": "It is customary to send an agenda before the meeting starts.",
        "exampleVi": "Việc gửi chương trình họp trước khi cuộc họp bắt đầu là thông lệ.",
        "collocations": ["customary practice", "customary behavior", "customary procedure"],
        "synonyms": ["usual", "traditional", "conventional"],
        "wordFamily": ["custom", "customer", "customize"],
        "day": 10
    },
    ("itinerary", "noun"): {
        "id": "seating-arrangement-phrase",
        "word": "seating arrangement",
        "baseWord": "seat",
        "type": "phrase",
        "meaning": "sự sắp xếp chỗ ngồi",
        "pronunciation": "/ˈsiːtɪŋ əˈreɪndʒmənt/",
        "topic": "Meetings & Scheduling",
        "frequency": "medium",
        "level": "easy",
        "partTags": ["Part 3", "Part 4", "Part 7"],
        "example": "The organizers changed the seating arrangement to facilitate discussion.",
        "exampleVi": "Ban tổ chức đã thay đổi cách sắp xếp chỗ ngồi để tạo điều kiện thuận lợi cho cuộc thảo luận.",
        "collocations": ["make a seating arrangement", "seating arrangement plan", "flexible seating arrangement"],
        "synonyms": ["seating plan", "layout"],
        "wordFamily": ["seat", "seating", "arrange", "arrangement"],
        "day": 10
    }
}

count = 0
for idx, entry in enumerate(data):
    key = (entry["word"].lower(), entry["type"])
    if key in replacements:
        data[idx] = replacements[key]
        print(f"Replaced {key} with {replacements[key]['word']}")
        count += 1

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Total replacements made: {count}")
