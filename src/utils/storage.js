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

export const reviewWord = (wordId, quality) => {
  const reviews = getObject(STORAGE_KEYS.wordReviews, {});
  const current = reviews[wordId] ?? { correct: 0, again: 0, easy: 0, interval: 0, lastReviewed: null, nextReview: null };
  const intervals = { again: 1, hard: 2, good: Math.max(3, current.interval + 3), easy: Math.max(7, current.interval + 7) };
  const interval = intervals[quality] ?? 3;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  const next = {
    ...reviews,
    [wordId]: {
      ...current,
      correct: quality === "again" ? current.correct : current.correct + 1,
      again: quality === "again" ? current.again + 1 : current.again,
      easy: quality === "easy" ? current.easy + 1 : current.easy,
      interval,
      lastReviewed: new Date().toISOString(),
      nextReview: nextDate.toISOString().slice(0, 10),
    },
  };
  write(STORAGE_KEYS.wordReviews, next);
  return next;
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
