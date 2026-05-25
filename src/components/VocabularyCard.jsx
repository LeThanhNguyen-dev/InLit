import { BadgeCheck, BookOpen, Star } from "lucide-react";

export default function VocabularyCard({ word, learned, difficult, onLearned, onDifficult }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-vault-ink">{word.word}</h3>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-vault-muted">{word.type}</span>
            {word.learningGroup && <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{word.learningGroup}</span>}
          </div>
          <p className="text-sm text-vault-muted">{word.pronunciation}</p>
        </div>
        <span className="rounded-full bg-vault-purple/10 px-3 py-1 text-xs font-bold text-vault-purple">Ngày {word.day}</span>
      </div>
      <p className="mt-4 text-base font-semibold text-vault-ink">{word.meaning}</p>
      <p className="mt-3 text-sm text-vault-muted">{word.example}</p>
      {word.exampleVi && !word.exampleVi.startsWith("Cau vi du") && <p className="text-sm text-vault-muted">{word.exampleVi}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {word.collocations.map((item) => (
          <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{item}</span>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <button onClick={() => onLearned(word.id)} className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${learned ? "bg-vault-mint text-white" : "bg-slate-100 text-vault-ink"}`}>
          <BadgeCheck size={17} /> Đã học
        </button>
        <button onClick={() => onDifficult(word.id)} className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${difficult ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-vault-ink"}`}>
          <Star size={17} /> Từ khó
        </button>
      </div>
    </article>
  );
}
