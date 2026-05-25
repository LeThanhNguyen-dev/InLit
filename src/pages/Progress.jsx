import { BarChart3, BookOpen, Brain, CalendarCheck, Clock, FileText, Star, Target, TriangleAlert } from "lucide-react";
import PartCard from "../components/PartCard.jsx";
import ProfilePanel from "../components/ProfilePanel.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import StatCard from "../components/StatCard.jsx";
import WeeklyBarChart from "../components/WeeklyBarChart.jsx";
import { getProgressSnapshot } from "../utils/progress";
import { addPartSession, exportVaultData } from "../utils/storage";
import { useState } from "react";

export default function Progress() {
  const [version, setVersion] = useState(0);
  const snapshot = getProgressSnapshot();
  const practice = (partId) => {
    addPartSession(partId, 10);
    setVersion((value) => value + 1);
  };
  const exportData = () => {
    const payload = JSON.stringify(exportVaultData(), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `englishvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-black">Tiến độ</h1><p className="text-vault-muted">Momentum, điểm dự đoán, lỗi sai và Part yếu nhất của bạn.</p></div>
        <button onClick={exportData} className="focus-ring rounded-xl bg-vault-purple px-5 py-3 font-bold text-white">Xuất backup</button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="card grid place-items-center p-6"><ProgressRing value={snapshot.overall} size={190} /></div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={Target} value={`${snapshot.projectedScore.low}-${snapshot.projectedScore.high}`} label="Score dự đoán" bg="bg-vault-purple/10" color="text-vault-purple" />
          <StatCard icon={BarChart3} value={`${snapshot.consistency}%`} label="Độ đều" bg="bg-blue-50" color="text-blue-600" />
          <StatCard icon={TriangleAlert} value={snapshot.openErrors.length} label="Lỗi đang mở" bg="bg-red-50" color="text-red-600" />
          <StatCard icon={BookOpen} value={snapshot.learnedWords.length} label="Từ đã học" bg="bg-blue-50" color="text-blue-600" />
          <StatCard icon={Star} value={snapshot.difficultWords.length} label="Từ khó" bg="bg-amber-50" color="text-amber-600" />
          <StatCard icon={FileText} value={snapshot.completedGrammar.length} label="Bài ngữ pháp" />
          <StatCard icon={CalendarCheck} value={snapshot.completedDays.length} label="Ngày đã xong" bg="bg-emerald-50" color="text-emerald-600" />
          <StatCard icon={Brain} value={snapshot.quizScores.length} label="Quiz đã làm" bg="bg-vault-purple/10" color="text-vault-purple" />
          <StatCard icon={Clock} value={`${Math.max(0.5, snapshot.completedDays.length * 0.5).toFixed(1)}h`} label="Thời gian học" bg="bg-slate-100" color="text-vault-ink" />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-black">Weakness System</h2>
          <p className="mt-2 text-vault-muted">
            Part yếu nhất hiện tại: <span className="font-black text-red-600">{snapshot.weakestPart?.number} - {snapshot.weakestPart?.title}</span>.
          </p>
          <p className="mt-2 text-sm text-vault-muted">
            Pattern lỗi thường gặp: {snapshot.commonMistakes.length ? snapshot.commonMistakes.join(", ") : "chưa đủ dữ liệu"}.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-black">Smart Review Queue</h2>
          <p className="mt-2 text-vault-muted">{snapshot.dueReviews.length} từ/cụm đang đến hạn ôn, ưu tiên từ khó và từ sai nhiều.</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-5 flex items-center gap-2"><BarChart3 className="text-vault-purple" /><h2 className="text-xl font-black">Tiến độ tuần</h2></div>
        <div className="h-80 min-h-80 min-w-0">
          <WeeklyBarChart height={320} />
        </div>
      </div>
      <ProfilePanel />
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-black text-vault-ink">Tiến độ theo từng Part</h2>
          <p className="text-vault-muted">Mỗi Part có số buổi luyện, số phút và phần trăm hoàn thành riêng.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.partStats.map((part) => <PartCard key={`${part.id}-${version}`} part={part} onPractice={practice} />)}
        </div>
      </div>
    </div>
  );
}
