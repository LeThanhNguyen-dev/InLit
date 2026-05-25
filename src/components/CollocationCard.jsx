import { Link2 } from "lucide-react";

export default function CollocationCard({ item, learned, onLearned }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
          <Link2 size={21} />
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-vault-muted">Day {item.day}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-vault-ink">{item.phrase}</h3>
      <p className="font-semibold text-emerald-700">{item.meaning}</p>
      <p className="mt-3 text-sm text-vault-muted">{item.example}</p>
      <button onClick={() => onLearned(item.id)} className={`focus-ring mt-5 w-full rounded-xl px-3 py-2 text-sm font-bold ${learned ? "bg-vault-mint text-white" : "bg-emerald-50 text-emerald-700"}`}>
        {learned ? "Đã học" : "Đánh dấu đã học"}
      </button>
    </article>
  );
}
