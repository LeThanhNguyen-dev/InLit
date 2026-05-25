import vocabulary from "../data/vocabulary.json";
import grammar from "../data/grammar.json";

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export const generateQuiz = (limit = 10) => {
  const vocabularyQuestions = vocabulary.map((word) => {
    const distractors = shuffle(vocabulary.filter((item) => item.id !== word.id))
      .slice(0, 3)
      .map((item) => item.meaning);
    return {
      id: `word-${word.id}`,
      type: "Từ vựng",
      question: `"${word.word}" có nghĩa là gì?`,
      options: shuffle([word.meaning, ...distractors]),
      answer: word.meaning,
      explanation: word.example,
    };
  });

  const grammarQuestions = grammar.flatMap((lesson) =>
    lesson.practice.map((item, index) => ({
      id: `grammar-${lesson.id}-${index}`,
      type: "Ngữ pháp",
      question: item.question,
      options: item.options,
      answer: item.answer,
      explanation: item.explanation,
    }))
  );

  return shuffle([...vocabularyQuestions, ...grammarQuestions]).slice(0, limit);
};
