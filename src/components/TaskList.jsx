import { CheckCircle2, Circle } from "lucide-react";

export default function TaskList({ tasks = [], completed = false, onComplete }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-vault-ink">Việc cần làm hôm nay</h3>
        {onComplete && (
          <button onClick={onComplete} className={`focus-ring rounded-xl px-3 py-2 text-sm font-bold ${completed ? "bg-vault-mint text-white" : "bg-vault-purple/10 text-vault-purple"}`}>
            {completed ? "Ngày đã xong" : "Hoàn thành ngày"}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div key={task} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
            {completed ? <CheckCircle2 className="text-vault-mint" size={20} /> : <Circle className={["text-blue-500","text-emerald-500","text-vault-purple","text-amber-500"][index % 4]} size={20} />}
            <span className="text-sm font-medium text-vault-ink">{task}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
