import { useMemo, useState } from "react";
import {
  Bot,
  ClipboardList,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import {
  AI_TASKS,
  askAICoach,
  buildErrorCoachContext,
  buildReviewCoachContext,
  buildTodayCoachContext,
} from "../utils/aiCoach";
import { getProgressSnapshot } from "../utils/progress";

const formatResult = (text) =>
  text.split("\n").map((line, index) => (
    <p key={`${line}-${index}`} className={line.trim().startsWith("-") ? "pl-4" : ""}>
      {line || "\u00A0"}
    </p>
  ));

export default function AICoach() {
  const snapshot = useMemo(() => getProgressSnapshot(), []);
  const [task, setTask] = useState("today_plan");
  const [context, setContext] = useState(() => buildTodayCoachContext(snapshot));
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedTask = AI_TASKS.find((item) => item.id === task) ?? AI_TASKS[0];

  const runCoach = async (force = false) => {
    setLoading(true);
    setError("");
    try {
      const answer = await askAICoach({ task, context, force });
      setResult(answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gọi được AI Coach.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-vault-purple to-vault-blue p-6 text-white shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              <Sparkles size={16} />
              Personal TOEIC Coach
            </div>
            <h1 className="text-3xl font-bold">AI Coach cho EnglishVault</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/85">
              Dùng Gemini để giải thích lỗi sai, tạo câu tương tự, phân tích passage và gợi ý review.
              AI chỉ chạy khi bạn bấm nút, kết quả được cache trong localStorage.
            </p>
          </div>
          <div className="rounded-2xl bg-white/12 p-4 text-sm">
            <p className="font-semibold">Hôm nay: Day {snapshot.studyDay}</p>
            <p className="text-white/80">Part yếu: {snapshot.weakestPart?.name ?? "chưa đủ dữ liệu"}</p>
            <p className="text-white/80">Score dự đoán: {snapshot.projectedScore.low}-{snapshot.projectedScore.high}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-vault-purple/10 text-vault-purple">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-vault-ink">Bạn muốn AI hỗ trợ gì?</h2>
              <p className="text-sm text-vault-muted">{selectedTask.description}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {AI_TASKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTask(item.id)}
                className={[
                  "rounded-2xl border p-4 text-left transition",
                  task === item.id
                    ? "border-vault-purple bg-vault-purple/10 text-vault-purple"
                    : "border-slate-100 bg-slate-50 text-vault-ink hover:border-vault-purple/30",
                ].join(" ")}
              >
                <p className="font-bold">{item.label}</p>
                <p className="mt-1 text-xs text-vault-muted">{item.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setContext(buildTodayCoachContext(snapshot))}
              className="rounded-xl bg-vault-purple/10 px-3 py-2 text-sm font-semibold text-vault-purple"
            >
              Kế hoạch hôm nay
            </button>
            <button
              type="button"
              onClick={() => setContext(buildErrorCoachContext(snapshot))}
              className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600"
            >
              Lỗi đang mở
            </button>
            <button
              type="button"
              onClick={() => setContext(buildReviewCoachContext(snapshot))}
              className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-600"
            >
              Review queue
            </button>
          </div>

          <label className="mt-5 block text-sm font-semibold text-vault-ink" htmlFor="ai-context">
            Dữ liệu gửi cho AI
          </label>
          <textarea
            id="ai-context"
            value={context}
            onChange={(event) => setContext(event.target.value)}
            className="mt-2 h-80 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-vault-ink outline-none transition focus:border-vault-purple focus:bg-white"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => runCoach(false)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-vault-purple px-5 py-3 font-bold text-white shadow-lg shadow-vault-purple/25 transition hover:bg-vault-purple/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Hỏi AI Coach
            </button>
            <button
              type="button"
              onClick={() => runCoach(true)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 py-3 font-bold text-vault-ink transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={18} />
              Bỏ cache, hỏi lại
            </button>
          </div>

          <div className="mt-4 flex gap-2 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 shrink-0" size={17} />
            <p>
              Không dán API key vào đây. Key phải nằm trong biến môi trường
              <span className="font-bold"> GEMINI_API_KEY </span>
              trên Vercel.
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-vault-blue/10 text-vault-blue">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-vault-ink">Kết quả coaching</h2>
              <p className="text-sm text-vault-muted">
                {result?.cached ? "Đang hiển thị kết quả cache để tiết kiệm API." : "AI sẽ trả lời tại đây sau khi bạn bấm hỏi."}
              </p>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="min-h-[460px] rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-vault-ink">
            {result?.text ? (
              <div className="space-y-1">{formatResult(result.text)}</div>
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center text-center text-vault-muted">
                <Sparkles className="mb-3 text-vault-purple" size={34} />
                <p className="max-w-md font-semibold text-vault-ink">Chọn tác vụ, kiểm tra dữ liệu gửi đi, rồi bấm Hỏi AI Coach.</p>
                <p className="mt-2 max-w-md">
                  Gợi ý tốt nhất: sau khi làm đề trên Prep, dán câu sai vào đây để AI biến nó thành bài ôn riêng cho bạn.
                </p>
              </div>
            )}
          </div>

          {result?.model ? (
            <p className="mt-3 text-xs text-vault-muted">
              Model: {result.model} • {result.cached ? "cache localStorage" : "vừa gọi API"}
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
