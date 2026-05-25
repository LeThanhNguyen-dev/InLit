import { BarChart3, BookOpen, Brain, Calendar, FileText, Link2, PanelsTopLeft, Target, Trophy } from "lucide-react";
import ProgressRing from "../components/ProgressRing.jsx";
import StatCard from "../components/StatCard.jsx";
import TaskList from "../components/TaskList.jsx";
import WeeklyBarChart from "../components/WeeklyBarChart.jsx";
import vocabulary from "../data/vocabulary.json";
import collocations from "../data/collocations.json";
import grammar from "../data/grammar.json";
import studyPlan from "../data/studyPlan.json";
import roadmap from "../data/targetRoadmap.json";
import { currentStudyDay, getProgressSnapshot } from "../utils/progress";
import { STORAGE_KEYS, toggleId, updateStreak } from "../utils/storage";

export default function Dashboard() {
  const today = currentStudyDay();
  const plan = studyPlan.find((item) => item.day === today) ?? studyPlan[0];
  const snapshot = getProgressSnapshot();
  const words = vocabulary.filter((word) => plan.newWords.includes(word.id));
  const todaysCollocations = collocations.filter((item) => plan.collocations.includes(item.id));
  const lesson = grammar.find((item) => plan.grammarIds.includes(item.id));
  const completed = snapshot.completedDays.includes(plan.day);

  const completeDay = () => {
    toggleId(STORAGE_KEYS.completedDays, plan.day);
    updateStreak();
    window.location.reload();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-vault-ink">Chào buổi sáng, {snapshot.profile.name}!</h1>
            <p className="mt-1 text-vault-muted">{snapshot.profile.goal}</p>
          </div>
          <div className="subtle-card flex items-center gap-3 px-4 py-3">
            <Calendar className="text-vault-purple" size={20} />
            <div>
              <p className="font-bold">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              <p className="text-sm text-vault-muted">{new Date().toLocaleDateString("en-US", { weekday: "long" })}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Kế hoạch hôm nay - Ngày {plan.day}</h2>
              <p className="mt-1 font-semibold text-vault-purple">{plan.title} • Lộ trình TOEIC {roadmap.targetScore}+</p>
              <p className="mt-2 text-sm font-semibold text-vault-muted">{plan.estimatedMinutes} phút • 20 từ/cụm: {plan.coreWords?.length ?? 12} core + {plan.scanWords?.length ?? 8} scan • Prep: {plan.prepPractice}</p>
            </div>
            <button onClick={completeDay} className={`focus-ring rounded-xl px-5 py-3 font-bold ${completed ? "bg-vault-mint text-white" : "bg-vault-purple text-white"}`}>
              {completed ? "Đã hoàn thành" : "Bắt đầu học"}
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StatCard icon={BookOpen} value={words.length} label="Từ/cụm hôm nay" hint="12 core + 8 scan" bg="bg-blue-50" color="text-blue-600" />
            <StatCard icon={Link2} value={todaysCollocations.length} label="Cụm từ" hint="Kết hợp từ tự nhiên" bg="bg-emerald-50" color="text-emerald-600" />
            <StatCard icon={FileText} value={lesson ? 1 : 0} label="Ngữ pháp" hint={lesson?.title} />
            <StatCard icon={Brain} value={10} label="Câu quiz" hint="Kiểm tra lại kiến thức" bg="bg-amber-50" color="text-amber-600" />
          </div>
          <div className="mt-4 rounded-xl bg-vault-purple/10 px-4 py-3 text-sm font-bold text-vault-purple">
            Hàng đợi ôn tập: {snapshot.dueReviews.length} từ cần ôn hôm nay
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="card p-5">
            <div className="mb-4 flex justify-between">
              <h3 className="font-bold">Từ vựng mới</h3>
              <span className="text-sm font-semibold text-vault-purple">Ngày {plan.day}</span>
            </div>
            <div className="space-y-3">
              {words.slice(0, 5).map((word) => (
                <div key={word.id} className="flex justify-between gap-4 text-sm">
                  <div>
                    <p className="font-bold">{word.word}</p>
                    <p className="text-vault-muted">{word.pronunciation}</p>
                  </div>
                  <p className="text-right text-vault-muted">{word.meaning}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-bold">Ngữ pháp hôm nay</h3>
            <h4 className="mt-10 text-2xl font-black text-vault-purple">{lesson?.title}</h4>
            <p className="mt-3 text-vault-muted">{lesson?.meaning}</p>
            <p className="mt-8 text-sm text-vault-muted">Ví dụ:</p>
            <p className="font-semibold">{lesson?.examples[0].en}</p>
          </div>
          <div className="card p-5">
            <h3 className="font-bold">Cụm từ hôm nay</h3>
            <div className="mt-5 space-y-4">
              {todaysCollocations.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 border-b border-slate-100 pb-3 text-sm last:border-0">
                  <p className="font-bold">{item.phrase}</p>
                  <p className="text-right text-vault-muted">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TaskList tasks={[...plan.tasks, `Ôn lại ${plan.reviewWords.length} từ từ các ngày trước`]} completed={completed} onComplete={completeDay} />

        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-vault-ink">Tiến độ theo Part</h2>
              <p className="text-sm text-vault-muted">Mỗi Part TOEIC được theo dõi riêng để biết phần nào đang yếu.</p>
            </div>
            <PanelsTopLeft className="text-vault-purple" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {snapshot.partStats.slice(0, 7).map((part) => (
              <div key={part.id} className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-vault-ink">{part.number}</p>
                  <span className="text-xs font-bold text-vault-muted">{part.skill}</span>
                </div>
                <p className="mt-1 truncate text-sm text-vault-muted">{part.title}</p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-vault-purple" style={{ width: `${part.percent}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-vault-muted">{part.sessions} buổi • {part.percent}%</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-5">
        <div className="card p-6 text-center">
          <h3 className="mb-4 text-left text-lg font-bold">Tiến độ tổng</h3>
          <ProgressRing value={snapshot.overall} />
        </div>
        <div className="card p-6">
          <h3 className="font-bold">Chuỗi ngày học</h3>
          <p className="mt-4 text-5xl font-black">{snapshot.streak.count || 0}</p>
          <p className="text-vault-muted">ngày</p>
          <p className="mt-4 rounded-xl bg-vault-purple/10 px-3 py-2 text-sm font-semibold text-vault-purple">
            Mục tiêu mỗi ngày: {snapshot.profile.dailyMinutes} phút
          </p>
          <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            Giai đoạn: {snapshot.phase.name}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="mb-4 font-bold">Tiến độ tuần</h3>
          <div className="h-48 min-h-48 min-w-0">
            <WeeklyBarChart height={192} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Trophy} value={snapshot.quizScores.length} label="Bài quiz" />
          <StatCard icon={Target} value={snapshot.difficultWords.length} label="Từ khó" bg="bg-amber-50" color="text-amber-600" />
          <StatCard icon={BookOpen} value={snapshot.learnedWords.length} label="Từ đã học" bg="bg-blue-50" color="text-blue-600" />
          <StatCard icon={BarChart3} value={`${snapshot.overall}%`} label="Tổng" />
        </div>
      </aside>
    </div>
  );
}
