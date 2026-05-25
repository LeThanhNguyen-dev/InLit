import { Headphones, PenLine, Timer } from "lucide-react";

const skillStyle = {
  Listening: "bg-blue-50 text-blue-700",
  Grammar: "bg-vault-purple/10 text-vault-purple",
  Reading: "bg-emerald-50 text-emerald-700",
};

export default function PartCard({ part, onPractice }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-vault-purple">{part.number}</p>
          <h3 className="mt-1 text-xl font-black text-vault-ink">{part.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${skillStyle[part.skill]}`}>
          {part.skill}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-vault-muted">{part.focus}</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-vault-muted">
        <p className="font-bold text-vault-ink">Recommended</p>
        <p>{part.recommended}</p>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm font-semibold">
          <span>{part.sessions} / {part.targetSessions} sessions</span>
          <span>{part.percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-vault-purple" style={{ width: `${part.percent}%` }} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
          <Timer size={17} className="text-vault-purple" />
          <span className="font-semibold">{part.minutes || 0} phút</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
          {part.skill === "Listening" ? <Headphones size={17} className="text-blue-600" /> : <PenLine size={17} className="text-emerald-600" />}
          <span className="font-semibold">{part.lastPracticed ? "Đã luyện" : "Mới"}</span>
        </div>
      </div>

      <button onClick={() => onPractice(part.id)} className="focus-ring mt-5 w-full rounded-xl bg-vault-purple px-4 py-3 font-bold text-white">
        Ghi nhận 10 phút luyện
      </button>
    </article>
  );
}
