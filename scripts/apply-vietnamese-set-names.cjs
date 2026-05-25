const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "src", "data");
const vocabularyPath = path.join(dataDir, "vocabulary.json");
const studyPlanPath = path.join(dataDir, "studyPlan.json");

const setNames = {
  "Office Foundation": "Nền tảng công sở",
  "Transactions and Service": "Giao dịch và dịch vụ",
  "People and Policy": "Nhân sự và chính sách",
  "Trips and Reservations": "Du lịch và đặt chỗ",
  "Appointments and Treatment": "Lịch hẹn và điều trị",
  "Money and Reports": "Tiền bạc và báo cáo",
  "Better Work Habits": "Thói quen làm việc hiệu quả",
  "Emails and Messages": "Email và tin nhắn",
  "Meetings and Decisions": "Cuộc họp và quyết định",
  "Projects and Deadlines": "Dự án và hạn chót",
  "Presentations": "Thuyết trình",
  "Customer Service": "Dịch vụ khách hàng",
  "Sales and Marketing": "Bán hàng và marketing",
  "Contracts and Legal": "Hợp đồng và pháp lý",
  "Reports and Data": "Báo cáo và dữ liệu",
  "Accounting Basics": "Kế toán cơ bản",
  "Banking and Payments": "Ngân hàng và thanh toán",
  "Shipping and Logistics": "Vận chuyển và logistics",
  "Manufacturing": "Sản xuất",
  "Quality Control": "Kiểm soát chất lượng",
  "Office Technology": "Công nghệ văn phòng",
  "Software and Tools": "Phần mềm và công cụ",
  "Travel Planning": "Lập kế hoạch du lịch",
  "Hotels and Accommodation": "Khách sạn và chỗ ở",
  "Airports and Transportation": "Sân bay và giao thông",
  "Restaurants and Food": "Nhà hàng và đồ ăn",
  "Shopping and Retail": "Mua sắm và bán lẻ",
  "Health Appointments": "Lịch hẹn y tế",
  "Workplace Safety": "An toàn nơi làm việc",
  "Human Resources": "Nhân sự",
  "Training and Development": "Đào tạo và phát triển",
  "Performance Reviews": "Đánh giá hiệu suất",
  "Leadership": "Lãnh đạo",
  "Teamwork": "Làm việc nhóm",
  "Problem Solving": "Giải quyết vấn đề",
  "Productivity Habits": "Thói quen năng suất",
  "Time Management": "Quản lý thời gian",
  "Reading Emails": "Đọc email",
  "Reading Notices": "Đọc thông báo",
  "Reading Articles": "Đọc bài viết",
  "Grammar: Tenses": "Ngữ pháp: Các thì",
  "Grammar: Modals": "Ngữ pháp: Động từ khuyết thiếu",
  "Grammar: Conditionals": "Ngữ pháp: Câu điều kiện",
  "Grammar: Comparisons": "Ngữ pháp: So sánh",
  "Grammar: Word Forms": "Ngữ pháp: Dạng từ",
  "Listening: Photos": "Nghe: Mô tả tranh",
  "Listening: Questions": "Nghe: Câu hỏi phản hồi",
  "Listening: Conversations": "Nghe: Hội thoại",
  "Listening: Talks": "Nghe: Bài nói ngắn",
  "TOEIC Part 5 Practice": "TOEIC Part 5",
  "TOEIC Part 6 Practice": "TOEIC Part 6",
  "TOEIC Part 7 Practice": "TOEIC Part 7",
  "Business Strategy": "Chiến lược kinh doanh",
  "Negotiation": "Đàm phán",
  "Events and Conferences": "Sự kiện và hội nghị",
  "Real Estate and Facilities": "Bất động sản và cơ sở vật chất",
  "Environment and Energy": "Môi trường và năng lượng",
  "Education and Learning": "Giáo dục và học tập",
  "Media and Advertising": "Truyền thông và quảng cáo",
  "Personal Finance": "Tài chính cá nhân",
};

const vocabulary = JSON.parse(fs.readFileSync(vocabularyPath, "utf8"));
const studyPlan = JSON.parse(fs.readFileSync(studyPlanPath, "utf8"));

const nextVocabulary = vocabulary.map((word) => ({
  ...word,
  set: setNames[word.set] ?? word.set,
  note: word.note?.includes("trong bộ")
    ? `Ôn "${word.word}" trong bộ ${setNames[word.set] ?? word.set} và tự đặt 1 câu riêng.`
    : word.note,
}));

const nextStudyPlan = studyPlan.map((day) => ({
  ...day,
  title: setNames[day.title] ?? day.title,
}));

fs.writeFileSync(vocabularyPath, `${JSON.stringify(nextVocabulary, null, 2)}\n`);
fs.writeFileSync(studyPlanPath, `${JSON.stringify(nextStudyPlan, null, 2)}\n`);
console.log("Updated Vietnamese set names.");
