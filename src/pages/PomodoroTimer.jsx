import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Coffee, Zap, Volume2 } from "lucide-react";

const PRESETS = {
  pomodoro: { work: 25 * 60, break: 5 * 60, label: "Pomodoro" },
  short: { work: 15 * 60, break: 3 * 60, label: "Short Focus" },
  long: { work: 50 * 60, break: 10 * 60, label: "Deep Work" },
  toefl: { work: 20 * 60, break: 5 * 60, label: "TOEIC Drill" },
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  const [preset, setPreset] = useState("pomodoro");
  const [phase, setPhase] = useState("work");
  const [remaining, setRemaining] = useState(PRESETS.pomodoro.work);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const total = PRESETS[preset][phase];
  const progress = ((total - remaining) / total) * 100;

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        if (phase === "work") {
          setSessions((s) => s + 1);
          setPhase("break");
          return PRESETS[preset].break;
        } else {
          setPhase("work");
          return PRESETS[preset].work;
        }
      }
      return prev - 1;
    });
  }, [phase, preset]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const toggle = () => setRunning((r) => !r);

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPhase("work");
    setRemaining(PRESETS[preset].work);
  };

  const changePreset = (key) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setPreset(key);
    setPhase("work");
    setRemaining(PRESETS[key].work);
  };

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const isWork = phase === "work";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-vault-ink">Pomodoro Timer</h1>
        <p className="text-vault-muted">Quản lý thời gian học tập hiệu quả với kỹ thuật Pomodoro.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([key, { label }]) => (
          <button key={key} onClick={() => changePreset(key)} className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold ${preset === key ? "bg-vault-purple text-white" : "bg-white text-vault-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="card flex flex-col items-center p-8">
        <div className={`mb-2 rounded-full px-3 py-1 text-xs font-bold ${isWork ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
          {isWork ? "LÀM VIỆC" : "NGHỈ NGƠI"}
        </div>
        <div className="relative my-4">
          <svg width="140" height="140" className="-rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="70" cy="70" r={radius} fill="none" stroke={isWork ? "#ef4444" : "#22c55e"} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-black text-vault-ink">{formatTime(remaining)}</p>
            <p className="text-xs font-semibold text-vault-muted">{isWork ? "tập trung" : "thư giãn"}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={toggle} className="focus-ring flex items-center gap-2 rounded-xl bg-vault-purple px-6 py-3 font-bold text-white">
            {running ? <Pause size={18} /> : <Play size={18} />}
            {running ? "Tạm dừng" : "Bắt đầu"}
          </button>
          <button onClick={reset} className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-vault-ink hover:bg-slate-50">
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="subtle-card flex items-center gap-3 p-4">
          <Zap className="text-red-500" size={20} />
          <div>
            <p className="text-2xl font-black text-vault-ink">{sessions}</p>
            <p className="text-xs text-vault-muted">Buổi đã hoàn thành</p>
          </div>
        </div>
        <div className="subtle-card flex items-center gap-3 p-4">
          <Coffee className="text-emerald-500" size={20} />
          <div>
            <p className="text-2xl font-black text-vault-ink">{sessions * 5}</p>
            <p className="text-xs text-vault-muted">Phút nghỉ đã có</p>
          </div>
        </div>
        <div className="subtle-card flex items-center gap-3 p-4">
          <Play className="text-vault-purple" size={20} />
          <div>
            <p className="text-2xl font-black text-vault-ink">{sessions * 25}</p>
            <p className="text-xs text-vault-muted">Phút tập trung</p>
          </div>
        </div>
        <div className="subtle-card flex items-center gap-3 p-4">
          <Volume2 className="text-amber-500" size={20} />
          <div>
            <p className="text-2xl font-black text-vault-ink">{PRESETS[preset].label}</p>
            <p className="text-xs text-vault-muted">Chế độ hiện tại</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-vault-ink">Mẹo sử dụng Pomodoro</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Tắt thông báo điện thoại khi bắt đầu buổi.",
            "Ghi lại số câu quiz được mỗi buổi Pomodoro.",
            "Sau 4 buổi, nghỉ dài 15-20 phút.",
            "Đặt mục tiêu cụ thể cho mỗi 25 phút.",
            "Không kiểm tra email trong giờ tập trung.",
            "Uống nước mỗi lần chuyển phase.",
          ].map((tip) => (
            <div key={tip} className="flex gap-2 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-vault-ink">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-vault-purple" />
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
