import { ArrowLeft, ArrowRight, RotateCcw, Star } from "lucide-react";

export default function Flashcard({ word, flipped, onFlip, onPrev, onNext, onLearned, onDifficult, onReview, learned, difficult, review }) {
  if (!word) return <div className="card p-8 text-center text-vault-muted">Không có thẻ nào khớp bộ lọc này.</div>;

  return (
    <div className="card mx-auto max-w-2xl p-6">
      <button onClick={onFlip} className="focus-ring grid min-h-72 w-full place-items-center rounded-2xl bg-gradient-to-br from-vault-purple/10 to-blue-50 p-8 text-center">
        {!flipped ? (
          <div>
            <p className="text-sm font-bold uppercase text-vault-purple">Bấm để lật thẻ</p>
            <h2 className="mt-4 text-5xl font-black text-vault-ink">{word.word}</h2>
            <p className="mt-3 text-vault-muted">{word.pronunciation}</p>
            <p className="mt-2 text-sm font-semibold text-vault-muted">Ngày {word.day} • {word.set}</p>
          </div>
        ) : (
          <div>
            <p className="text-3xl font-black text-vault-ink">{word.meaning}</p>
            <p className="mt-5 text-vault-muted">{word.example}</p>
            {word.exampleVi && !word.exampleVi.startsWith("Cau vi du") && <p className="text-vault-muted">{word.exampleVi}</p>}
          </div>
        )}
      </button>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onPrev} className="focus-ring rounded-xl bg-slate-100 p-3 text-vault-ink"><ArrowLeft size={20} /></button>
        <div className="flex gap-2">
          <button onClick={onFlip} className="focus-ring flex items-center gap-2 rounded-xl bg-vault-purple/10 px-4 py-3 font-bold text-vault-purple"><RotateCcw size={18} /> Lật</button>
          <button onClick={() => onLearned(word.id)} className={`focus-ring rounded-xl px-4 py-3 font-bold ${learned ? "bg-vault-mint text-white" : "bg-slate-100 text-vault-ink"}`}>Đã học</button>
          <button onClick={() => onDifficult(word.id)} className={`focus-ring rounded-xl px-4 py-3 font-bold ${difficult ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-vault-ink"}`}><Star size={18} /></button>
        </div>
        <button onClick={onNext} className="focus-ring rounded-xl bg-slate-100 p-3 text-vault-ink"><ArrowRight size={20} /></button>
      </div>
      {flipped && (
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            ["again", "Học lại"],
            ["hard", "Khó"],
            ["good", "Ổn"],
            ["easy", "Dễ"],
          ].map(([quality, label]) => (
            <button key={quality} onClick={() => onReview(word.id, quality)} className="focus-ring rounded-xl bg-white px-3 py-2 text-sm font-bold text-vault-ink shadow-sm">
              {label}
            </button>
          ))}
        </div>
      )}
      {review?.nextReview && <p className="mt-3 text-center text-xs font-semibold text-vault-muted">Lần ôn tiếp theo: {review.nextReview}</p>}
    </div>
  );
}
