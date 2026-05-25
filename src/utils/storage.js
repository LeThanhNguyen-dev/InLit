export const STORAGE_KEYS = {
  learnedWords: "englishvault_learned_words",
  difficultWords: "englishvault_difficult_words",
  completedGrammar: "englishvault_completed_grammar",
  completedDays: "englishvault_completed_days",
  quizScores: "englishvault_quiz_scores",
  notes: "englishvault_notes",
  streak: "englishvault_streak",
  learnedCollocations: "englishvault_learned_collocations",
  completedReadings: "englishvault_completed_readings",
  profile: "englishvault_profile",
  partProgress: "englishvault_part_progress",
  wordReviews: "englishvault_word_reviews",
  errorLogs: "englishvault_error_logs",
  shadowingSentences: "englishvault_shadowing_sentences",
};

export const DEFAULT_PROFILE = {
  name: "Hoang Nam",
  goal: "TOEIC confidence and daily English habit",
  level: "A2-B1",
  dailyMinutes: 30,
  focusPart: "part5",
};

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("englishvault-storage"));
};

export const getArray = (key) => read(key, []);
export const setArray = (key, value) => write(key, [...new Set(value)]);
export const getObject = (key, fallback = {}) => read(key, fallback);
export const setObject = (key, value) => write(key, value);

export const getProfile = () => ({
  ...DEFAULT_PROFILE,
  ...getObject(STORAGE_KEYS.profile, DEFAULT_PROFILE),
});

export const saveProfile = (profile) => write(STORAGE_KEYS.profile, { ...DEFAULT_PROFILE, ...profile });

export const toggleId = (key, id) => {
  const numericId = Number(id);
  const values = getArray(key);
  const next = values.includes(numericId)
    ? values.filter((value) => value !== numericId)
    : [...values, numericId];
  setArray(key, next);
  return next;
};

export const addQuizScore = (score) => {
  const scores = getArray(STORAGE_KEYS.quizScores);
  write(STORAGE_KEYS.quizScores, [
    ...scores,
    { ...score, id: Date.now(), date: new Date().toISOString() },
  ]);
};

export const updateStreak = () => {
  const today = new Date().toISOString().slice(0, 10);
  const streak = getObject(STORAGE_KEYS.streak, { count: 0, lastDate: null });
  if (streak.lastDate === today) return streak;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const next = {
    count: streak.lastDate === yesterdayKey ? streak.count + 1 : 1,
    lastDate: today,
  };
  write(STORAGE_KEYS.streak, next);
  return next;
};

export const addPartSession = (partId, minutes = 10) => {
  const progress = getObject(STORAGE_KEYS.partProgress, {});
  const current = progress[partId] ?? { sessions: 0, minutes: 0, lastPracticed: null };
  const next = {
    ...progress,
    [partId]: {
      sessions: current.sessions + 1,
      minutes: current.minutes + minutes,
      lastPracticed: new Date().toISOString(),
    },
  };
  write(STORAGE_KEYS.partProgress, next);
  updateStreak();
  return next;
};

const reviewReasonPenalty = {
  meaning: 12,
  listening: 18,
  synonym: 14,
  collocation: 16,
  grammar: 10,
};

export const reviewWord = (wordId, quality, reason = "meaning") => {
  const reviews = getObject(STORAGE_KEYS.wordReviews, {});
  const current = reviews[wordId] ?? {
    easeFactor: 2.5,
    correct: 0,
    wrongCount: 0,
    again: 0,
    easy: 0,
    interval: 0,
    mastery: 35,
    reasons: {},
    lastReviewed: null,
    nextReview: null,
  };
  const isWrong = quality === "again" || quality === "hard";
  const easeDelta = { again: -0.28, hard: -0.16, good: 0.04, easy: 0.12 }[quality] ?? 0;
  const easeFactor = Math.max(1.3, Math.min(2.8, current.easeFactor + easeDelta));
  const masteryDelta = { again: -reviewReasonPenalty[reason], hard: -8, good: 10, easy: 16 }[quality] ?? 6;
  const mastery = Math.max(0, Math.min(100, (current.mastery ?? 35) + masteryDelta));
  const baseInterval = current.interval || 1;
  const intervals = {
    again: 1,
    hard: Math.max(1, Math.round(baseInterval * 1.2)),
    good: Math.max(2, Math.round(baseInterval * easeFactor)),
    easy: Math.max(5, Math.round(baseInterval * easeFactor * 1.7)),
  };
  const interval = intervals[quality] ?? 3;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  const next = {
    ...reviews,
    [wordId]: {
      ...current,
      easeFactor,
      correct: isWrong ? current.correct : current.correct + 1,
      wrongCount: isWrong ? (current.wrongCount ?? 0) + 1 : current.wrongCount ?? 0,
      again: quality === "again" ? current.again + 1 : current.again,
      easy: quality === "easy" ? current.easy + 1 : current.easy,
      mastery,
      reasons: {
        ...(current.reasons ?? {}),
        [reason]: ((current.reasons ?? {})[reason] ?? 0) + (isWrong ? 1 : 0),
      },
      interval,
      lastReviewed: new Date().toISOString(),
      nextReview: nextDate.toISOString().slice(0, 10),
    },
  };
  write(STORAGE_KEYS.wordReviews, next);
  return next;
};

export const addErrorLog = (entry) => {
  const logs = getArray(STORAGE_KEYS.errorLogs);
  const next = [
    {
      id: Date.now(),
      date: new Date().toISOString(),
      status: "open",
      part: "Part 5",
      category: "vocab",
      mistakeType: "vocab",
      question: "",
      correctAnswer: "",
      chosenAnswer: "",
      explanation: "",
      keywords: [],
      relatedWords: [],
      reviewAfterDays: 3,
      ...entry,
    },
    ...logs,
  ];
  write(STORAGE_KEYS.errorLogs, next);
  return next;
};

export const updateErrorLog = (id, patch) => {
  const logs = getArray(STORAGE_KEYS.errorLogs);
  const next = logs.map((log) => (log.id === id ? { ...log, ...patch } : log));
  write(STORAGE_KEYS.errorLogs, next);
  return next;
};

export const parsePrepMistake = (rawText) => {
  const lines = rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const text = rawText.toLowerCase();
  const partMatch = rawText.match(/part\s*[1-7]/i);
  const category = text.includes("grammar") ? "grammar" : text.includes("paraphrase") ? "paraphrase" : text.includes("transcript") ? "listening" : "vocab";
  const mistakeType = text.includes("number") || text.includes("date")
    ? "miss_number_date"
    : text.includes("distractor")
      ? "distractor"
      : text.includes("keyword")
        ? "miss_keyword"
        : category;
  return {
    part: partMatch ? partMatch[0].replace(/\s+/, " ") : "Part 5",
    category,
    mistakeType,
    question: lines[0] ?? "",
    explanation: lines.slice(1).join("\n"),
  };
};

export const exportVaultData = () => {
  const data = Object.fromEntries(Object.values(STORAGE_KEYS).map((key) => [key, read(key, null)]));
  return {
    app: "EnglishVault",
    version: 2,
    exportedAt: new Date().toISOString(),
    data,
  };
};
