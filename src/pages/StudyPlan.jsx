import { BookOpen, CheckCircle2, FileText, Layers } from "lucide-react";
import studyPlan from "../data/studyPlan.json";
import grammar from "../data/grammar.json";
import roadmap from "../data/targetRoadmap.json";
import { STORAGE_KEYS, getArray, toggleId, updateStreak } from "../utils/storage";
import { useState } from "react";

export default function StudyPlan() {
  const [version, setVersion] = useState(0);
  const completed = getArray(STORAGE_KEYS.completedDays);
  const mark = (day) => {
    toggleId(STORAGE_KEYS.completedDays, day);
    updateStreak();
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Kế hoạch học 150 ngày</h1>
          <p className="text-vault-muted">Lịch học 60-90 phút/ngày cho mục tiêu TOEIC {roadmap.targetScore}+: scan 20 từ/cụm, học kỹ 12 core words, làm Part trên Prep và ghi lỗi sai.</p>
        </div>
        <div className="subtle-card px-4 py-3">
          <p className="text-xs font-bold uppercase text-vault-muted">Tổng khối lượng</p>
          <p className="text-xl font-black text-vault-purple">{roadmap.totalVocabularyTarget.toLocaleString()} từ</p>
        </div>
      </header>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {studyPlan.map((day) => {
          const lessonNames = day.grammarIds.map((id) => grammar.find((item) => item.id === id)?.title).filter(Boolean).join(", ");
          const isDone = completed.includes(day.day);
          return (
            <article key={day.day} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-bold text-vault-purple">Ngày {day.day}</p><h2 className="text-xl font-black">{day.title}</h2></div>
                <CheckCircle2 className={isDone ? "text-vault-mint" : "text-slate-300"} />
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                <p className="flex items-center gap-2"><BookOpen size={18} className="text-blue-600" /> {day.newWords.length} từ mới</p>
                <p className="flex items-center gap-2"><Layers size={18} className="text-vault-purple" /> {day.coreWords?.length ?? 12} core + {day.scanWords?.length ?? 8} scan</p>
                <p className="flex items-center gap-2"><Layers size={18} className="text-emerald-600" /> {day.reviewWords.length} từ ôn lại</p>
                <p className="flex items-center gap-2"><FileText size={18} className="text-vault-purple" /> {lessonNames}</p>
                <p className="rounded-xl bg-blue-50 px-3 py-2 font-semibold text-blue-700">Focus: {day.focusSkill}</p>
                <p className="rounded-xl bg-amber-50 px-3 py-2 font-semibold text-amber-700">Prep: {day.prepPractice}</p>
              </div>
              <button onClick={() => mark(day.day)} className={`focus-ring mt-5 w-full rounded-xl px-3 py-2 font-bold ${isDone ? "bg-vault-mint text-white" : "bg-vault-purple/10 text-vault-purple"}`}>{isDone ? "Đã xong" : "Đánh dấu hoàn thành"}</button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
