import { BarChart3, BookOpen, Brain, Calendar, FileText, Headphones, Keyboard, Link2, PanelsTopLeft, PenLine, Target, Trophy, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
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

const mistakeLabels = {
  vocab: "từ vựng",
  paraphrase: "paraphrase",
  grammar: "ngữ pháp",
  distractor: "bẫy nhiễu",
  miss_keyword: "miss keyword",
  miss_number_date: "miss number/date",
  collocation: "collocation",
};

const learningModules = [
  {
    title: "Vocabulary TOEIC",
    description: "Xây dựng vốn từ vựng theo 40 chủ đề TOEIC phổ biến nhất",
    bullets: [
      "2,000+ từ vựng theo chủ đề",
      "Flashcard giúp ghi nhớ nhanh",
      "Kiểm tra từ vựng giúp rèn luyện tư duy",
      "Phím tắt thao tác nhanh cho Flashcard và Kiểm tra",
    ],
    to: "/vocabulary",
    icon: BookOpen,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "Grammar TOEIC",
    description: "Nắm vững 38 chủ đề ngữ pháp trọng tâm trong đề thi",
    bullets: [
      "38 chủ đề ngữ pháp trọng tâm",
      "Giải thích chi tiết dễ hiểu",
      "Lỗi thường gặp & cách khắc phục",
      "Ứng dụng trong đề thi và giao tiếp thực tế",
    ],
    to: "/grammar",
    icon: FileText,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    title: "Listening TOEIC",
    description: "Luyện nghe Part 1-4 với chiến lược và kỹ thuật làm bài hiệu quả",
    bullets: [
      "Luyện tập theo Part 1-4",
      "Audio chuẩn đề thi thật",
      "Transcript & Giải thích chi tiết",
      "Chiến lược làm bài từng phần",
    ],
    to: "/parts",
    icon: Headphones,
    tone: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Nghe chép chính tả",
    description: "Rèn phản xạ nghe sâu và ghi nhớ từ vựng qua việc chép chính tả",
    bullets: [
      "Nghe chép chính tả từng câu",
      "Nghe lật từ rèn phản xạ",
      "Tự động chấm điểm & sửa lỗi",
      "Hỗ trợ phím tắt thông minh",
    ],
    to: "/shadowing",
    icon: Keyboard,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Reading TOEIC",
    description: "Làm chủ Part 5-7 với các dạng câu hỏi và kỹ thuật đọc hiểu",
    bullets: [
      "Part 5: Incomplete Sentences",
      "Part 6: Text Completion",
      "Part 7: Reading Comprehension",
      "Chiến lược quản lý thời gian",
    ],
    to: "/reading",
    icon: PenLine,
    tone: "bg-amber-50 text-amber-700",
  },
];

export default function Dashboard() {
  const today = currentStudyDay();
  const plan = studyPlan.find((item) => item.day === today) ?? studyPlan[0];
  const snapshot = getProgressSnapshot();
  const words = vocabulary.filter((word) => plan.newWords.includes(word.id));
  const todaysCollocations = collocations.filter((item) => plan.collocations.includes(item.id));
  const lesson = grammar.find((item) => plan.grammarIds.includes(item.id));
  const completed = snapshot.completedDays.includes(plan.day);
  const weakest = snapshot.weakestPart;
  const mistakeText = snapshot.commonMistakes.length
    ? snapshot.commonMistakes.map((item) => mistakeLabels[item] ?? item).join(", ")
    : "chưa có pattern lỗi rõ";

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
            <h1 className="text-3xl font-black text-vault-ink">Hôm nay mình học gì?</h1>
            <p className="mt-1 text-vault-muted">
              {snapshot.profile.name}, bạn đang ở {snapshot.phase.name}. Tập trung: {plan.focusSkill}.
            </p>
          </div>
          <div className="subtle-card flex items-center gap-3 px-4 py-3">
            <Calendar className="text-vault-purple" size={20} />
            <div>
              <p className="font-bold">{new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
              <p className="text-sm text-vault-muted">Ngày {plan.day} / {roadmap.totalDays}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {learningModules.map(({ title, description, bullets, to, icon: Icon, tone }) => (
            <article key={title} className="card flex min-h-80 flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-vault-ink">{title}</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-vault-muted">{description}</p>
                </div>
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}>
                  <Icon size={22} />
                </div>
              </div>
              <ul className="mt-5 flex-1 space-y-3 text-sm font-semibold text-vault-ink">
                {bullets.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-vault-purple" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to={to} className="focus-ring mt-5 inline-flex items-center justify-center rounded-xl bg-vault-purple px-4 py-3 text-sm font-bold text-white">
                Bắt đầu học
              </Link>
            </article>
          ))}
        </div>

        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Kế hoạch hôm nay - {plan.title}</h2>
              <p className="mt-1 font-semibold text-vault-purple">
                {plan.estimatedMinutes} phút • 20 từ/cụm: {plan.coreWords?.length ?? 12} core + {plan.scanWords?.length ?? 8} scan
              </p>
              <p className="mt-2 text-sm font-semibold text-vault-muted">Prep hôm nay: {plan.prepPractice}</p>
            </div>
            <button onClick={completeDay} className={`focus-ring rounded-xl px-5 py-3 font-bold ${completed ? "bg-vault-mint text-white" : "bg-vault-purple text-white"}`}>
              {completed ? "Đã hoàn thành" : "Bắt đầu học"}
            </button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StatCard icon={BookOpen} value={words.length} label="Từ/cụm hôm nay" hint="12 core + 8 scan" bg="bg-blue-50" color="text-blue-600" />
            <StatCard icon={Link2} value={todaysCollocations.length} label="Cụm từ" hint="Kết hợp từ tự nhiên" bg="bg-emerald-50" color="text-emerald-600" />
            <StatCard icon={FileText} value={lesson ? 1 : 0} label="Ngữ pháp" hint={lesson?.title} />
            <StatCard icon={Brain} value={snapshot.dueReviews.length} label="Cần ôn" hint="Smart review queue" bg="bg-amber-50" color="text-amber-600" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="card p-5">
            <div className="mb-4 flex justify-between">
              <h3 className="font-bold">Scan 20 từ/cụm</h3>
              <span className="text-sm font-semibold text-vault-purple">Ngày {plan.day}</span>
            </div>
            <div className="space-y-3">
              {words.slice(0, 8).map((word) => (
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
            <h3 className="font-bold">Coach nhắc bạn</h3>
            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-xl bg-red-50 p-3 text-red-700">
                <p className="font-black">Part yếu nhất</p>
                <p>{weakest ? `${weakest.number} - ${weakest.title} (${weakest.accuracy}% accuracy giả lập)` : "Chưa đủ dữ liệu"}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-800">
                <p className="font-black">Pattern lỗi</p>
                <p>{mistakeText}</p>
              </div>
              <div className="rounded-xl bg-vault-purple/10 p-3 text-vault-purple">
                <p className="font-black">Score dự đoán nếu giữ pace</p>
                <p>{snapshot.projectedScore.low}-{snapshot.projectedScore.high}</p>
              </div>
            </div>
          </div>
          <div className="card p-5">
            <h3 className="font-bold">Ngữ pháp hôm nay</h3>
            <h4 className="mt-6 text-2xl font-black text-vault-purple">{lesson?.title}</h4>
            <p className="mt-3 text-vault-muted">{lesson?.meaning}</p>
            <p className="mt-6 text-sm text-vault-muted">Ví dụ:</p>
            <p className="font-semibold">{lesson?.examples[0].en}</p>
          </div>
        </div>

        <TaskList tasks={[...plan.tasks, `Ôn lại ${plan.reviewWords.length} từ từ các ngày trước`]} completed={completed} onComplete={completeDay} />

        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-vault-ink">Tiến độ theo Part</h2>
              <p className="text-sm text-vault-muted">App dùng Error Log và số buổi luyện để tìm phần yếu cần sửa.</p>
            </div>
            <PanelsTopLeft className="text-vault-purple" />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {snapshot.partAccuracy.slice(0, 7).map((part) => (
              <div key={part.id} className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-vault-ink">{part.number}</p>
                  <span className="text-xs font-bold text-vault-muted">{part.accuracy}%</span>
                </div>
                <p className="mt-1 truncate text-sm text-vault-muted">{part.title}</p>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-vault-purple" style={{ width: `${part.accuracy}%` }} />
                </div>
                <p className="mt-2 text-xs font-semibold text-vault-muted">{part.errors} lỗi đang mở</p>
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
          <h3 className="font-bold">Study Momentum</h3>
          <p className="mt-4 text-5xl font-black">{snapshot.consistency}%</p>
          <p className="text-vault-muted">độ đều so với ngày hiện tại</p>
          <p className="mt-4 rounded-xl bg-vault-purple/10 px-3 py-2 text-sm font-semibold text-vault-purple">
            Mục tiêu mỗi ngày: {snapshot.profile.dailyMinutes} phút
          </p>
          <p className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
            Giai đoạn: {snapshot.phase.name}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="mb-4 font-bold">Smart Review Queue</h3>
          <div className="space-y-3">
            {snapshot.dueReviews.slice(0, 5).map((word) => {
              const review = snapshot.wordReviews[word.id] ?? {};
              return (
                <div key={word.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <p className="font-black">{word.word}</p>
                    <p className="font-bold text-vault-purple">{review.mastery ?? 35}%</p>
                  </div>
                  <p className="text-vault-muted">{word.meaning}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2">
            <TriangleAlert className="text-amber-600" />
            <h3 className="font-bold">Error Log</h3>
          </div>
          <p className="text-4xl font-black text-red-600">{snapshot.openErrors.length}</p>
          <p className="text-sm text-vault-muted">lỗi đang mở cần sửa</p>
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
