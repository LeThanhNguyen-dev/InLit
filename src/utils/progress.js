import vocabulary from "../data/vocabulary.json";
import grammar from "../data/grammar.json";
import readings from "../data/readings.json";
import studyPlan from "../data/studyPlan.json";
import learningParts from "../data/parts.json";
import roadmap from "../data/targetRoadmap.json";
import { getArray, getObject, getProfile, STORAGE_KEYS } from "./storage";

export const currentStudyDay = () => {
  const start = new Date("2026-05-25T00:00:00");
  const today = new Date();
  const diff = Math.floor((today - start) / 86400000);
  return Math.min(studyPlan.length, Math.max(1, diff + 1));
};

const parseRange = (range) => range.split("-").map((value) => Number(value));

export const currentRoadmapPhase = (day = currentStudyDay()) =>
  roadmap.phases.find((phase) => {
    const [start, end] = parseRange(phase.days);
    return day >= start && day <= end;
  }) ?? roadmap.phases[0];

export const getProgressSnapshot = () => {
  const learnedWords = getArray(STORAGE_KEYS.learnedWords);
  const difficultWords = getArray(STORAGE_KEYS.difficultWords);
  const completedGrammar = getArray(STORAGE_KEYS.completedGrammar);
  const completedDays = getArray(STORAGE_KEYS.completedDays);
  const quizScores = getArray(STORAGE_KEYS.quizScores);
  const completedReadings = getArray(STORAGE_KEYS.completedReadings);
  const streak = getObject(STORAGE_KEYS.streak, { count: 0, lastDate: null });
  const partProgress = getObject(STORAGE_KEYS.partProgress, {});
  const wordReviews = getObject(STORAGE_KEYS.wordReviews, {});
  const errorLogs = getArray(STORAGE_KEYS.errorLogs);
  const profile = getProfile();
  const partStats = learningParts.map((part) => {
    const progress = partProgress[part.id] ?? { sessions: 0, minutes: 0, lastPracticed: null };
    return {
      ...part,
      ...progress,
      percent: Math.min(100, Math.round((progress.sessions / part.targetSessions) * 100)),
    };
  });

  const progressParts = [
    learnedWords.length / vocabulary.length,
    completedGrammar.length / grammar.length,
    completedDays.length / studyPlan.length,
    completedReadings.length / readings.length,
  ];
  const overall = Math.round((progressParts.reduce((sum, part) => sum + part, 0) / progressParts.length) * 100);
  const today = new Date().toISOString().slice(0, 10);
  const dueReviews = vocabulary
    .filter((word) => difficultWords.includes(word.id) || !wordReviews[word.id]?.nextReview || wordReviews[word.id].nextReview <= today)
    .sort((a, b) => {
      const reviewA = wordReviews[a.id] ?? {};
      const reviewB = wordReviews[b.id] ?? {};
      const scoreA = (difficultWords.includes(a.id) ? 40 : 0) + (reviewA.wrongCount ?? 0) * 12 + (100 - (reviewA.mastery ?? 35));
      const scoreB = (difficultWords.includes(b.id) ? 40 : 0) + (reviewB.wrongCount ?? 0) * 12 + (100 - (reviewB.mastery ?? 35));
      return scoreB - scoreA;
    });
  const studyDay = currentStudyDay();
  const phase = currentRoadmapPhase(studyDay);
  const openErrors = errorLogs.filter((error) => error.status !== "resolved");
  const partAccuracy = learningParts.map((part) => {
    const partErrors = openErrors.filter((error) => error.part?.toLowerCase().replace(/\s+/g, "") === part.id);
    const sessions = partStats.find((item) => item.id === part.id)?.sessions ?? 0;
    const accuracy = Math.max(35, Math.min(92, 78 + sessions * 2 - partErrors.length * 7));
    return { ...part, accuracy, errors: partErrors.length };
  });
  const weakestPart = [...partAccuracy].sort((a, b) => a.accuracy - b.accuracy)[0];
  const mistakeCounts = openErrors.reduce((acc, error) => {
    acc[error.mistakeType] = (acc[error.mistakeType] ?? 0) + 1;
    return acc;
  }, {});
  const commonMistakes = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name);
  const consistency = Math.min(100, Math.round((completedDays.length / Math.max(1, studyDay)) * 100));
  const projectedScoreLow = Math.min(700, Math.round(320 + overall * 3.2 + consistency * 0.9 - openErrors.length * 3));
  const projectedScoreHigh = Math.min(780, projectedScoreLow + 50);

  return {
    learnedWords,
    difficultWords,
    completedGrammar,
    completedDays,
    quizScores,
    completedReadings,
    streak,
    profile,
    partStats,
    wordReviews,
    errorLogs,
    openErrors,
    dueReviews,
    partAccuracy,
    weakestPart,
    commonMistakes,
    consistency,
    projectedScore: {
      low: projectedScoreLow,
      high: projectedScoreHigh,
    },
    roadmap,
    phase,
    studyDay,
    overall,
    totals: {
      vocabulary: vocabulary.length,
      grammar: grammar.length,
      studyDays: studyPlan.length,
      readings: readings.length,
      quizzes: quizScores.length,
    },
  };
};

export const weeklyProgress = () => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const completedDays = getArray(STORAGE_KEYS.completedDays);
  const quizScores = getArray(STORAGE_KEYS.quizScores);
  return labels.map((name, index) => ({
    name,
    progress: Math.min(100, (completedDays.includes(index + 1) ? 45 : 10) + quizScores.length * 8 + index * 4),
  }));
};
