import vocabulary from "../data/vocabulary.json";
import studyPlan from "../data/studyPlan.json";
import { getObject, setObject, STORAGE_KEYS } from "./storage";

export const AI_CACHE_KEY = "englishvault_ai_cache";

export const AI_TASKS = [
  {
    id: "today_plan",
    label: "Lên kế hoạch hôm nay",
    description: "Biến roadmap, review queue và Part yếu thành lịch học 60-90 phút.",
  },
  {
    id: "explain_error",
    label: "Giải thích lỗi sai",
    description: "Phân tích lỗi Prep/ETS và chỉ ra cách sửa.",
  },
  {
    id: "similar_questions",
    label: "Tạo câu tương tự",
    description: "Sinh câu luyện lại đúng dạng bạn vừa sai.",
  },
  {
    id: "analyze_passage",
    label: "Phân tích passage",
    description: "Extract vocab, collocation, paraphrase và bẫy đọc hiểu.",
  },
  {
    id: "review_suggestion",
    label: "Gợi ý review queue",
    description: "Ưu tiên từ khó, lỗi lặp lại và kiến thức sắp quên.",
  },
  {
    id: "note_to_cards",
    label: "Biến note thành cards",
    description: "Chuyển ghi chú/lỗi sai thành review cards để ôn lại.",
  },
];

const compactHash = (text) => {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

export const getAICache = () => getObject(AI_CACHE_KEY, {});

export const askAICoach = async ({ task, context, force = false }) => {
  const normalized = String(context ?? "").trim();
  const cacheKey = `${task}:${compactHash(normalized)}`;
  const cache = getAICache();

  if (!force && cache[cacheKey]) {
    return { ...cache[cacheKey], cached: true };
  }

  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task, context: normalized }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Không gọi được AI Coach.");
  }

  const nextCache = {
    ...cache,
    [cacheKey]: {
      text: data.text,
      model: data.model,
      createdAt: new Date().toISOString(),
    },
  };
  setObject(AI_CACHE_KEY, nextCache);
  return { ...nextCache[cacheKey], cached: false };
};

export const buildTodayCoachContext = (snapshot) => {
  const day = snapshot.studyDay;
  const plan = studyPlan.find((item) => item.day === day) ?? studyPlan[0];
  const words = vocabulary.filter((word) => plan.newWords.includes(word.id));
  const dueWords = snapshot.dueReviews.slice(0, 12);
  const errors = snapshot.openErrors.slice(0, 5);

  return [
    `Ngày học: ${day}/${studyPlan.length}`,
    `Phase: ${snapshot.phase?.title ?? "Không rõ"}`,
    `Mục tiêu: TOEIC 700+, học 60-90 phút/ngày`,
    `Kế hoạch hôm nay: ${plan.title}`,
    `Focus skill: ${plan.focusSkill}`,
    `Prep practice: ${plan.prepPractice}`,
    `Part yếu nhất: ${snapshot.weakestPart?.name ?? "Chưa đủ dữ liệu"} - accuracy dự đoán ${snapshot.weakestPart?.accuracy ?? 0}%`,
    `Lỗi lặp lại: ${snapshot.commonMistakes.join(", ") || "Chưa có"}`,
    `Điểm dự đoán nếu giữ pace: ${snapshot.projectedScore.low}-${snapshot.projectedScore.high}`,
    "",
    "20 từ/cụm hôm nay:",
    words.map((word) => `- ${word.word}: ${word.meaning}; ví dụ: ${word.example}`).join("\n"),
    "",
    "Review queue ưu tiên:",
    dueWords.map((word) => `- ${word.word}: ${word.meaning}`).join("\n") || "- Chưa có review queue",
    "",
    "Lỗi sai đang mở:",
    errors
      .map((error) => `- ${error.part} | ${error.mistakeType}: ${error.question || error.explanation}`)
      .join("\n") || "- Chưa có lỗi sai",
  ].join("\n");
};

export const buildErrorCoachContext = (snapshot) => {
  const errors = snapshot.openErrors.slice(0, 8);
  return [
    "Các lỗi sai đang mở trong EnglishVault:",
    errors
      .map(
        (error) =>
          `- Part: ${error.part}\n  Loại lỗi: ${error.mistakeType}\n  Câu hỏi: ${error.question}\n  Chọn sai: ${error.chosenAnswer}\n  Đáp án đúng: ${error.correctAnswer}\n  Giải thích hiện có: ${error.explanation}`,
      )
      .join("\n\n") || "Chưa có lỗi sai. Hãy hướng dẫn cách nhập lỗi Prep hiệu quả.",
  ].join("\n");
};

export const buildReviewCoachContext = (snapshot) => {
  const reviews = getObject(STORAGE_KEYS.wordReviews, {});
  const words = snapshot.dueReviews.slice(0, 20);
  return [
    "Review queue hôm nay:",
    words
      .map((word) => {
        const review = reviews[word.id] ?? {};
        return `- ${word.word}: ${word.meaning}; mastery ${review.mastery ?? 35}; wrongCount ${review.wrongCount ?? 0}; nextReview ${review.nextReview ?? "now"}`;
      })
      .join("\n") || "Chưa có từ cần ôn.",
    "",
    `Từ khó đã mark: ${snapshot.difficultWords.length}`,
    `Từ đã học: ${snapshot.learnedWords.length}/${snapshot.totals.vocabulary}`,
  ].join("\n");
};
