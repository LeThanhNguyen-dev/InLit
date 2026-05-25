import { AlertTriangle, CheckCircle2, ClipboardPaste, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { addErrorLog, getArray, parsePrepMistake, STORAGE_KEYS, updateErrorLog } from "../utils/storage";
import { getProgressSnapshot } from "../utils/progress";

const categories = [
  ["vocab", "Từ vựng"],
  ["paraphrase", "Paraphrase"],
  ["grammar", "Ngữ pháp"],
  ["distractor", "Bẫy nhiễu"],
  ["miss_keyword", "Đọc/nghe thiếu keyword"],
  ["miss_number_date", "Miss number/date"],
  ["collocation", "Collocation"],
];

export default function ErrorLog() {
  const [version, setVersion] = useState(0);
  const [raw, setRaw] = useState("");
  const [draft, setDraft] = useState({
    part: "Part 5",
    category: "vocab",
    mistakeType: "vocab",
    question: "",
    chosenAnswer: "",
    correctAnswer: "",
    explanation: "",
  });
  const logs = getArray(STORAGE_KEYS.errorLogs);
  const snapshot = getProgressSnapshot();

  const grouped = useMemo(() => logs.reduce((acc, item) => {
    acc[item.mistakeType] = (acc[item.mistakeType] ?? 0) + 1;
    return acc;
  }, {}), [logs, version]);

  const save = () => {
    if (!draft.question.trim() && !draft.explanation.trim()) return;
    addErrorLog(draft);
    setDraft({ part: "Part 5", category: "vocab", mistakeType: "vocab", question: "", chosenAnswer: "", correctAnswer: "", explanation: "" });
    setVersion((value) => value + 1);
  };

  const importPrep = () => {
    if (!raw.trim()) return;
    setDraft((current) => ({ ...current, ...parsePrepMistake(raw) }));
  };

  const resolve = (id) => {
    updateErrorLog(id, { status: "resolved", resolvedAt: new Date().toISOString() });
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Error Log</h1>
          <p className="text-vault-muted">Trung tâm ghi lỗi sai từ Prep, quiz và review. Đây là phần quan trọng nhất để sửa điểm.</p>
        </div>
        <div className="subtle-card px-4 py-3">
          <p className="text-xs font-bold uppercase text-vault-muted">Lỗi đang mở</p>
          <p className="text-xl font-black text-red-600">{snapshot.openErrors.length}</p>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <ClipboardPaste className="text-vault-purple" />
              <h2 className="text-xl font-black">Import lỗi từ Prep</h2>
            </div>
            <textarea value={raw} onChange={(event) => setRaw(event.target.value)} rows="5" className="focus-ring w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Dán câu hỏi, transcript, đáp án, explanation từ Prep vào đây..." />
            <button onClick={importPrep} className="focus-ring mt-3 rounded-xl bg-vault-purple px-5 py-3 font-bold text-white">Tự điền form</button>
          </div>

          <div className="card grid gap-3 p-5 md:grid-cols-2">
            <select value={draft.part} onChange={(event) => setDraft({ ...draft, part: event.target.value })} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">
              {["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6", "Part 7"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={draft.mistakeType} onChange={(event) => setDraft({ ...draft, mistakeType: event.target.value, category: event.target.value })} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">
              {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <input value={draft.chosenAnswer} onChange={(event) => setDraft({ ...draft, chosenAnswer: event.target.value })} className="focus-ring rounded-xl border border-slate-200 px-4 py-3" placeholder="Đáp án đã chọn" />
            <input value={draft.correctAnswer} onChange={(event) => setDraft({ ...draft, correctAnswer: event.target.value })} className="focus-ring rounded-xl border border-slate-200 px-4 py-3" placeholder="Đáp án đúng" />
            <textarea value={draft.question} onChange={(event) => setDraft({ ...draft, question: event.target.value })} rows="3" className="focus-ring rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Câu hỏi / câu nghe / đoạn đọc gây lỗi" />
            <textarea value={draft.explanation} onChange={(event) => setDraft({ ...draft, explanation: event.target.value })} rows="4" className="focus-ring rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Vì sao sai? Keyword nào bị miss? Từ/cấu trúc nào cần ôn?" />
            <button onClick={save} className="focus-ring flex w-fit items-center gap-2 rounded-xl bg-vault-purple px-5 py-3 font-bold text-white"><Save size={18} /> Lưu lỗi sai</button>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <article key={log.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-vault-purple">{log.part} • {categories.find(([value]) => value === log.mistakeType)?.[1] ?? log.mistakeType}</p>
                    <h3 className="mt-1 font-black text-vault-ink">{log.question || "Lỗi chưa có câu hỏi"}</h3>
                  </div>
                  {log.status === "resolved" ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">Đã xử lý</span>
                  ) : (
                    <button onClick={() => resolve(log.id)} className="focus-ring rounded-xl bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">Đã sửa</button>
                  )}
                </div>
                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <p><span className="font-bold">Đã chọn:</span> {log.chosenAnswer || "Chưa ghi"}</p>
                  <p><span className="font-bold">Đáp án đúng:</span> {log.correctAnswer || "Chưa ghi"}</p>
                </div>
                {log.explanation && <p className="mt-3 whitespace-pre-wrap text-sm text-vault-muted">{log.explanation}</p>}
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="card p-5">
            <div className="mb-3 flex items-center gap-2"><AlertTriangle className="text-amber-600" /><h2 className="font-black">Pattern lỗi</h2></div>
            <div className="space-y-2">
              {Object.entries(grouped).map(([type, count]) => (
                <div key={type} className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold">
                  <span>{categories.find(([value]) => value === type)?.[1] ?? type}</span>
                  <span>{count}</span>
                </div>
              ))}
              {Object.keys(grouped).length === 0 && <p className="text-sm text-vault-muted">Chưa có lỗi nào. Khi làm Prep, hãy ghi lỗi vào đây.</p>}
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex items-center gap-2"><CheckCircle2 className="text-vault-mint" /><h2 className="font-black">Gợi ý học lại</h2></div>
            <p className="text-sm text-vault-muted">
              Nếu một loại lỗi lặp lại 3 lần, hãy chuyển nó thành bài ôn: thêm từ vào Từ khó, ghi grammar vào Notebook, rồi làm lại set Prep sau 3 ngày.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
