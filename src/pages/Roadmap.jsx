import { BookOpen, CalendarDays, CheckCircle2, ExternalLink, Flag, Target } from "lucide-react";
import { Link } from "react-router-dom";
import materials from "../data/materials.json";
import roadmap from "../data/targetRoadmap.json";
import { currentStudyDay, getProgressSnapshot } from "../utils/progress";

const parseRange = (range) => range.split("-").map((value) => Number(value));

export default function Roadmap() {
  const snapshot = getProgressSnapshot();
  const today = currentStudyDay();
  const activePhase = roadmap.phases.find((phase) => {
    const [start, end] = parseRange(phase.days);
    return today >= start && today <= end;
  }) ?? roadmap.phases[0];
  const completedPercent = Math.round((snapshot.completedDays.length / roadmap.totalDays) * 100);

  return (
    <div className="space-y-6">
      <header className="card overflow-hidden p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="font-bold text-vault-purple">Lộ trình cá nhân TOEIC 700+</p>
            <h1 className="mt-2 text-4xl font-black text-vault-ink">Từ mất gốc đến sẵn sàng thi tháng 10</h1>
            <p className="mt-3 max-w-3xl text-vault-muted">
              EnglishVault là nơi học chính trong 60-90 phút/ngày: scan 20 từ/cụm, học kỹ 12 core words, ngữ pháp, flashcard, đọc hiểu và sổ tay lỗi sai.
              Prep chỉ dùng để làm đề theo Part, mock test và lấy lỗi sai đem về đây sửa.
            </p>
          </div>
          <div className="rounded-2xl bg-vault-purple/10 p-5">
            <div className="flex items-center gap-3">
              <Target className="text-vault-purple" />
              <div>
                <p className="text-sm font-bold text-vault-muted">Mục tiêu</p>
                <p className="text-3xl font-black text-vault-purple">{roadmap.targetScore}+</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white p-3"><p className="text-vault-muted">Số ngày</p><p className="font-black">{roadmap.totalDays}</p></div>
              <div className="rounded-xl bg-white p-3"><p className="text-vault-muted">Từ vựng</p><p className="font-black">{roadmap.totalVocabularyTarget.toLocaleString()}</p></div>
              <div className="rounded-xl bg-white p-3"><p className="text-vault-muted">Kỳ thi</p><p className="font-black">{roadmap.examMonth}</p></div>
              <div className="rounded-xl bg-white p-3"><p className="text-vault-muted">Đã xong</p><p className="font-black">{completedPercent}%</p></div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {roadmap.phases.map((phase) => {
            const phaseMaterials = materials.filter((item) => item.phaseId === phase.id);
            const isActive = phase.id === activePhase.id;
            return (
              <article key={phase.id} className={`card p-5 ${isActive ? "ring-2 ring-vault-purple/30" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-vault-purple">Giai đoạn {phase.id} • Ngày {phase.days} • {phase.month}</p>
                    <h2 className="mt-1 text-2xl font-black text-vault-ink">{phase.name}</h2>
                    <p className="mt-2 text-sm font-semibold text-vault-muted">Mốc điểm: {phase.scoreBand}</p>
                  </div>
                  {isActive && <span className="rounded-full bg-vault-purple px-3 py-1 text-sm font-bold text-white">Đang học</span>}
                </div>

                <p className="mt-4 text-vault-muted">{phase.focus}</p>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-blue-50 p-4"><p className="font-bold text-blue-900">Nghe</p><p className="mt-1 text-sm text-blue-900/75">{phase.listening}</p></div>
                  <div className="rounded-xl bg-emerald-50 p-4"><p className="font-bold text-emerald-900">Đọc</p><p className="mt-1 text-sm text-emerald-900/75">{phase.reading}</p></div>
                  <div className="rounded-xl bg-vault-purple/10 p-4"><p className="font-bold text-vault-purple">Ngữ pháp</p><p className="mt-1 text-sm text-vault-ink/70">{phase.grammar}</p></div>
                  <div className="rounded-xl bg-amber-50 p-4"><p className="font-bold text-amber-900">Đầu ra mỗi ngày</p><p className="mt-1 text-sm text-amber-900/75">{phase.output}</p></div>
                </div>

                <div className="mt-5">
                  <h3 className="font-black text-vault-ink">Tài liệu cho giai đoạn này</h3>
                  <div className="mt-3 grid gap-3">
                    {phaseMaterials.map((item) => {
                      const external = item.link.startsWith("http");
                      const content = (
                        <div className="rounded-xl border border-slate-100 bg-white p-4 transition hover:border-vault-purple/30">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-vault-purple">{item.type} • {item.cadence}</p>
                              <p className="font-black text-vault-ink">{item.name}</p>
                              <p className="mt-1 text-sm text-vault-muted">{item.useFor}</p>
                            </div>
                            {external ? <ExternalLink size={18} className="text-vault-muted" /> : <BookOpen size={18} className="text-vault-muted" />}
                          </div>
                        </div>
                      );
                      return external ? (
                        <a key={item.id} href={item.link} target="_blank" rel="noreferrer">{content}</a>
                      ) : (
                        <Link key={item.id} to={item.link}>{content}</Link>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-vault-purple" />
              <div>
                <p className="font-black">Hôm nay: Ngày {today}</p>
                <p className="text-sm text-vault-muted">{activePhase.name}</p>
              </div>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-vault-purple" style={{ width: `${Math.min(100, (today / roadmap.totalDays) * 100)}%` }} />
            </div>
          </div>

          <div className="card p-5">
            <div className="mb-3 flex items-center gap-2"><Flag className="text-vault-purple" /><h2 className="font-black">Nhịp học mỗi tuần</h2></div>
            <div className="space-y-3">
              {roadmap.weeklyRoutine.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-vault-ink">
                  <CheckCircle2 size={18} className="text-vault-mint" /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-black">Cách dùng Prep</h2>
            <div className="mt-3 space-y-3 text-sm text-vault-muted">
              <p>1. Học trước trong EnglishVault: từ vựng, ngữ pháp, flashcard, đọc hiểu.</p>
              <p>2. Sau đó mới làm Part trên Prep để kiểm tra phản xạ.</p>
              <p>3. Câu nào sai thì ghi lại vào Sổ tay lỗi sai.</p>
              <p>4. Lỗi lặp lại phải biến thành từ khó hoặc bài ngữ pháp cần ôn.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
