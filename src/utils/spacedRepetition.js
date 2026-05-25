const todayKey = () => new Date().toISOString().slice(0, 10);

export const dueVocabulary = (words, difficultIds, learnedIds, mode = "today", day = 1, reviews = {}) => {
  if (mode === "difficult") return words.filter((word) => difficultIds.includes(word.id));
  if (mode === "learned") return words.filter((word) => learnedIds.includes(word.id));
  if (mode === "review") {
    const today = todayKey();
    return words
      .filter((word) => difficultIds.includes(word.id) || !reviews[word.id]?.nextReview || reviews[word.id].nextReview <= today)
      .sort((a, b) => {
        const reviewA = reviews[a.id] ?? {};
        const reviewB = reviews[b.id] ?? {};
        const scoreA = (difficultIds.includes(a.id) ? 40 : 0) + (reviewA.wrongCount ?? 0) * 12 + (100 - (reviewA.mastery ?? 35));
        const scoreB = (difficultIds.includes(b.id) ? 40 : 0) + (reviewB.wrongCount ?? 0) * 12 + (100 - (reviewB.mastery ?? 35));
        return scoreB - scoreA;
      });
  }
  if (mode === "day") return words.filter((word) => word.day === day);
  if (mode === "all") return words;
  return words.filter((word) => word.day === day || difficultIds.includes(word.id));
};
