import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarDays,
  FileText,
  GraduationCap,
  Headphones,
  Home,
  Layers,
  Library,
  Map,
  NotebookPen,
  PanelsTopLeft,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getProgressSnapshot } from "../utils/progress";

const links = [
  { to: "/", label: "Tổng quan", icon: Home },
  { to: "/roadmap", label: "Lộ trình", icon: Map },
  { to: "/study-plan", label: "Kế hoạch ngày", icon: CalendarDays },
  { to: "/vocabulary", label: "Vocabulary TOEIC", icon: BookOpen },
  { to: "/collocations", label: "Collocations", icon: Library },
  { to: "/grammar", label: "Grammar TOEIC", icon: FileText },
  { to: "/flashcards", label: "Flashcard", icon: Layers },
  { to: "/parts", label: "Listening TOEIC", icon: PanelsTopLeft },
  { to: "/quiz", label: "Kiểm tra", icon: Brain },
  { to: "/reading", label: "Reading TOEIC", icon: GraduationCap },
  { to: "/shadowing", label: "Nghe chép chính tả", icon: Headphones },
  { to: "/ai-coach", label: "AI Coach", icon: Sparkles },
  { to: "/progress", label: "Tiến độ", icon: BarChart3 },
  { to: "/error-log", label: "Error Log", icon: TriangleAlert },
  { to: "/notebook", label: "Sổ tay lỗi sai", icon: NotebookPen },
];

export default function Sidebar() {
  const snapshot = getProgressSnapshot();

  return (
    <aside className="border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r lg:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-vault-purple text-white shadow-lg shadow-vault-purple/25">
          <BookOpen size={24} />
        </div>
        <div>
          <p className="text-xl font-bold text-vault-ink">EnglishVault</p>
          <p className="text-xs text-vault-muted">Học TOEIC 700 có hệ thống</p>
        </div>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                isActive
                  ? "bg-vault-purple/12 text-vault-purple"
                  : "text-vault-ink/75 hover:bg-slate-100 hover:text-vault-ink",
              ].join(" ")
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 hidden rounded-2xl bg-white p-5 shadow-soft lg:block">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-vault-purple/10 text-vault-purple">
            <Target size={20} />
          </div>
          <div>
            <p className="font-semibold">Mục tiêu từ vựng</p>
            <p className="text-sm text-vault-muted">{snapshot.learnedWords.length} / {snapshot.totals.vocabulary} từ</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-vault-purple"
            style={{ width: `${Math.min(100, (snapshot.learnedWords.length / snapshot.totals.vocabulary) * 100)}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
