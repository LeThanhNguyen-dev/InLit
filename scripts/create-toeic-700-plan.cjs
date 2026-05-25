const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "src", "data");
const vocabularyPath = path.join(dataDir, "vocabulary.json");
const studyPlanPath = path.join(dataDir, "studyPlan.json");
const grammarPath = path.join(dataDir, "grammar.json");
const roadmapPath = path.join(dataDir, "targetRoadmap.json");

const TOTAL_DAYS = 150;
const NEW_ITEMS_PER_DAY = 20;
const CORE_ITEMS_PER_DAY = 12;
const TOTAL_ITEMS = TOTAL_DAYS * NEW_ITEMS_PER_DAY;

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const roadmap = JSON.parse(fs.readFileSync(roadmapPath, "utf8"));
const sourceVocabulary = JSON.parse(fs.readFileSync(vocabularyPath, "utf8"));

const selected = Array.from({ length: TOTAL_ITEMS }, (_, index) => {
  const source = sourceVocabulary[index % sourceVocabulary.length];
  return {
    ...source,
    id: index + 1,
    day: Math.floor(index / NEW_ITEMS_PER_DAY) + 1,
    note: source.note || `Ôn "${source.word}" trong ngữ cảnh TOEIC và tự đặt 1 câu riêng.`,
  };
});

const phaseForDay = (day) => {
  if (day <= 21) return { name: "Xây nền", prep: "Part 1-2 nhẹ", skill: "Nền câu + phản xạ nghe ngắn" };
  if (day <= 50) return { name: "Nền TOEIC", prep: "Part 1-2 + Part 5", skill: "Từ vựng công sở + ngữ pháp Part 5" };
  if (day <= 85) return { name: "Tăng tốc", prep: "Part 3-4 + Part 6", skill: "Nghe hội thoại/bài nói + đọc đoạn ngắn" };
  if (day <= 120) return { name: "Đẩy điểm", prep: "Part 5-7 bấm giờ", skill: "Sửa part yếu + tăng tốc đọc" };
  return { name: "Nước rút", prep: "Full test / mock", skill: "Chiến thuật đề + dọn lỗi lặp lại" };
};

const studyPlan = Array.from({ length: TOTAL_DAYS }, (_, dayIndex) => {
  const day = dayIndex + 1;
  const start = dayIndex * NEW_ITEMS_PER_DAY;
  const dayWords = selected.slice(start, start + NEW_ITEMS_PER_DAY);
  const coreWords = dayWords.slice(0, CORE_ITEMS_PER_DAY);
  const scanWords = dayWords.slice(CORE_ITEMS_PER_DAY);
  const reviewWords = selected
    .filter((word) => word.day >= Math.max(1, day - 7) && word.day < day)
    .slice(-24)
    .map((word) => word.id);
  const phase = phaseForDay(day);
  const grammarId = grammar[dayIndex % grammar.length].id;

  return {
    day,
    title: dayWords[0]?.set ?? `Ngày ${day}`,
    phase: phase.name,
    focusSkill: phase.skill,
    prepPractice: phase.prep,
    estimatedMinutes: "60-90",
    newWords: dayWords.map((word) => word.id),
    coreWords: coreWords.map((word) => word.id),
    scanWords: scanWords.map((word) => word.id),
    collocations: [],
    grammarIds: [grammarId],
    reviewWords,
    tasks: [
      "10 phút: ôn review queue và từ khó",
      "25 phút: scan 20 từ/cụm TOEIC hôm nay",
      "15 phút: học kỹ 12 core words chưa chắc",
      "15 phút: học 1 điểm ngữ pháp hoặc collocation",
      "15-25 phút: làm set Part trên Prep theo focus hôm nay",
      "10 phút: ghi lỗi sai vào Sổ tay lỗi sai",
    ],
  };
});

const nextRoadmap = {
  ...roadmap,
  dailyVocabularyTarget: NEW_ITEMS_PER_DAY,
  totalVocabularyTarget: TOTAL_ITEMS,
  weeklyRoutine: [
    "5 ngày scan 20 từ/cụm TOEIC, học kỹ 12 core words",
    "5 ngày làm set Part trên Prep sau khi học trong EnglishVault",
    "1 ngày review sâu: từ khó, lỗi sai, transcript, câu sai Part 5",
    "1 ngày mini mock hoặc full mock tùy giai đoạn",
  ],
};

fs.writeFileSync(vocabularyPath, `${JSON.stringify(selected, null, 2)}\n`);
fs.writeFileSync(studyPlanPath, `${JSON.stringify(studyPlan, null, 2)}\n`);
fs.writeFileSync(roadmapPath, `${JSON.stringify(nextRoadmap, null, 2)}\n`);

console.log(`Created TOEIC 700 plan: ${TOTAL_DAYS} days, ${TOTAL_ITEMS} vocabulary/collocation items.`);
