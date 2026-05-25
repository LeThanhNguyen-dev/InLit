import { useMemo, useState } from "react";
import QuizCard from "../components/QuizCard.jsx";
import { generateQuiz } from "../utils/quiz";
import { STORAGE_KEYS, addQuizScore, getArray } from "../utils/storage";

export default function Quiz() {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateQuiz(10), [seed]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const scores = getArray(STORAGE_KEYS.quizScores);
  const current = questions[index];
  const score = questions.filter((question) => answers[question.id] === question.answer).length;

  const submit = () => {
    setSubmitted(true);
    addQuizScore({ score, total: questions.length });
  };

  const restart = () => {
    setSeed((value) => value + 1);
    setIndex(0);
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header><h1 className="text-3xl font-black">Quiz</h1><p className="text-vault-muted">Luyện trắc nghiệm từ vựng và ngữ pháp.</p></header>
      <div className="card flex flex-wrap items-center justify-between gap-4 p-4">
        <p className="font-bold">Câu {index + 1} / {questions.length}</p>
        <p className="text-sm text-vault-muted">Số quiz đã làm: {scores.length}</p>
      </div>
      <QuizCard
        question={current}
        selected={answers[current.id]}
        onSelect={(option) => setAnswers((value) => ({ ...value, [current.id]: option }))}
        showAnswer={submitted}
      />
      <div className="flex flex-wrap justify-between gap-3">
        <button onClick={() => setIndex((value) => Math.max(0, value - 1))} className="focus-ring rounded-xl bg-white px-4 py-3 font-bold">Câu trước</button>
        <div className="flex gap-2">
          {index < questions.length - 1 ? (
            <button onClick={() => setIndex((value) => value + 1)} className="focus-ring rounded-xl bg-vault-purple px-5 py-3 font-bold text-white">Câu tiếp</button>
          ) : (
            <button onClick={submit} className="focus-ring rounded-xl bg-vault-purple px-5 py-3 font-bold text-white">Nộp bài</button>
          )}
          {submitted && <button onClick={restart} className="focus-ring rounded-xl bg-vault-mint px-5 py-3 font-bold text-white">Làm quiz mới</button>}
        </div>
      </div>
      {submitted && <div className="card p-6 text-center"><p className="text-4xl font-black text-vault-purple">{score} / {questions.length}</p><p className="text-vault-muted">Điểm đã được lưu trên trình duyệt của bạn.</p></div>}
    </div>
  );
}
