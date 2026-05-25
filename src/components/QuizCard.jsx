export default function QuizCard({ question, selected, onSelect, showAnswer }) {
  return (
    <div className="card p-6">
      <p className="text-sm font-bold uppercase text-vault-purple">{question.type}</p>
      <h2 className="mt-2 text-2xl font-bold text-vault-ink">{question.question}</h2>
      <div className="mt-5 grid gap-3">
        {question.options.map((option) => {
          const isCorrect = showAnswer && option === question.answer;
          const isWrong = showAnswer && selected === option && option !== question.answer;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={[
                "focus-ring rounded-xl border px-4 py-3 text-left font-semibold transition",
                selected === option ? "border-vault-purple bg-vault-purple/10 text-vault-purple" : "border-slate-100 bg-white text-vault-ink",
                isCorrect ? "border-vault-mint bg-emerald-50 text-emerald-700" : "",
                isWrong ? "border-red-300 bg-red-50 text-red-700" : "",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
      {showAnswer && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-vault-muted">
          <p><span className="font-bold text-vault-ink">Đáp án đúng:</span> {question.answer}</p>
          <p className="mt-1">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
