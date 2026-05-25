const todayKey = () => new Date().toISOString().slice(0, 10);

export const dueVocabulary = (words, difficultIds, learnedIds, mode = "today", day = 1, reviews = {}) => {
  if (mode === "difficult") return words.filter((word) => difficultIds.includes(word.id));
  if (mode === "learned") return words.filter((word) => learnedIds.includes(word.id));
  if (mode === "review") {
    const today = todayKey();
    return words.filter((word) => difficultIds.includes(word.id) || !reviews[word.id]?.nextReview || reviews[word.id].nextReview <= today);
  }
  if (mode === "day") return words.filter((word) => word.day === day);
  if (mode === "all") return words;
  return words.filter((word) => word.day === day || difficultIds.includes(word.id));
};
