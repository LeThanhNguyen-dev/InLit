import { CheckCircle2 } from "lucide-react";

export default function GrammarCard({ lesson, completed, onComplete }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-vault-purple">{lesson.level}</p>
          <h3 className="mt-1 text-xl font-bold text-vault-ink">{lesson.title}</h3>
          <p className="text-vault-muted">{lesson.meaning}</p>
        </div>
        <button onClick={() => onComplete(lesson.id)} className={`focus-ring rounded-xl px-3 py-2 text-sm font-bold ${completed ? "bg-vault-mint text-white" : "bg-vault-purple/10 text-vault-purple"}`}>
          {completed ? "Đã xong" : "Đánh dấu xong"}
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {Object.entries(lesson.structure).map(([key, value]) => (
          <div key={key} className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase text-vault-muted">{key}</p>
            <p className="mt-1 font-semibold text-vault-ink">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="font-bold text-vault-ink">Cách dùng</h4>
          <ul className="mt-2 space-y-1 text-sm text-vault-muted">
            {lesson.usage.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-vault-ink">Dấu hiệu</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {lesson.signals.map((item) => <span key={item} className="rounded-full bg-vault-purple/10 px-3 py-1 text-sm font-semibold text-vault-purple">{item}</span>)}
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-bold">Ví dụ</p>
        <p>{lesson.examples[0].en}</p>
        <p>{lesson.examples[0].vi}</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm text-vault-muted">
        <CheckCircle2 size={17} className="text-vault-mint" /> Có {lesson.practice.length} câu luyện tập
      </div>
    </article>
  );
}
