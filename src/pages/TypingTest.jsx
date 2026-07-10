import { useCallback, useEffect, useRef, useState } from "react";
import { Clock, RotateCcw, Trophy, Target, Zap, CheckCircle, XCircle } from "lucide-react";

const sentences = [
  "The quick brown fox jumps over the lazy dog near the river bank.",
  "Please submit your application before the deadline on Friday afternoon.",
  "The meeting has been rescheduled to next Tuesday at two o'clock.",
  "She decided to take a different route to avoid the heavy traffic downtown.",
  "The company announced its quarterly earnings during the investor call.",
  "Environmental protection is a growing concern for governments worldwide.",
  "The restaurant serves authentic Italian cuisine at reasonable prices.",
  "Students must complete all assignments before the end of the semester.",
  "The technology sector continues to evolve at an unprecedented pace.",
  "Effective communication is essential for building strong professional relationships.",
  "The government plans to invest heavily in renewable energy infrastructure.",
  "Regular exercise and a balanced diet are key to maintaining good health.",
  "The conference attracted over five hundred participants from around the world.",
  "Artificial intelligence is transforming industries across the global economy.",
  "The museum recently opened a new exhibition featuring modern contemporary art.",
  "Small businesses play a vital role in driving local economic growth.",
  "The airline offered discounted fares for passengers willing to fly during off-peak hours.",
  "Continuous learning and adaptability are crucial skills in today's job market.",
  "The researchers published their findings in a leading scientific journal.",
  "Urban planning must balance economic development with environmental sustainability.",
];

function getRandomSentence(exclude = "") {
  let s;
  do {
    s = sentences[Math.floor(Math.random() * sentences.length)];
  } while (s === exclude && sentences.length > 1);
  return s;
}

function calculateStats(original, typed, startTime, endTime) {
  const timeSeconds = (endTime - startTime) / 1000;
  const minutes = timeSeconds / 60;

  const originalWords = original.trim().split(/\s+/);
  const typedWords = typed.trim().split(/\s+/);
  const correctWords = originalWords.filter((w, i) => typedWords[i] === w).length;
  const wpm = minutes > 0 ? Math.round(correctWords / minutes) : 0;

  let correctChars = 0;
  const maxLen = Math.max(original.length, typed.length);
  for (let i = 0; i < maxLen; i++) {
    if (original[i] === typed[i]) correctChars++;
  }
  const accuracy = maxLen > 0 ? Math.round((correctChars / maxLen) * 100) : 0;

  return { wpm, accuracy, correctWords, totalWords: originalWords.length, timeSeconds: Math.round(timeSeconds) };
}

export default function TypingTest() {
  const [sentence, setSentence] = useState(() => getRandomSentence());
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const charCount = sentence.length;
  const inputLength = input.length;

  const chars = sentence.split("").map((char, i) => {
    let cls = "text-slate-300";
    if (i < inputLength) {
      cls = input[i] === char ? "text-vault-mint" : "text-red-500 bg-red-50 rounded";
    } else if (i === inputLength && status === "active") {
      cls = "border-b-2 border-vault-purple";
    }
    return (
      <span key={i} className={`${cls} transition-colors duration-75`}>
        {char}
      </span>
    );
  });

  const startTest = useCallback(() => {
    setInput("");
    setStatus("active");
    setStats(null);
    startTimeRef.current = Date.now();
    setCountdown(0);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const resetTest = useCallback(() => {
    clearInterval(timerRef.current);
    setSentence(getRandomSentence(sentence));
    setInput("");
    setStatus("idle");
    setStats(null);
    setCountdown(0);
    startTimeRef.current = null;
  }, [sentence]);

  const finishTest = useCallback(
    (finalInput) => {
      clearInterval(timerRef.current);
      const endTime = Date.now();
      const result = calculateStats(sentence, finalInput, startTimeRef.current, endTime);
      setStats(result);
      setStatus("done");
      setHistory((prev) => [result, ...prev].slice(0, 10));
    },
    [sentence]
  );

  const handleChange = (e) => {
    if (status !== "active") return;
    const val = e.target.value;
    setInput(val);
    if (val.length >= sentence.length) {
      finishTest(val);
    }
  };

  useEffect(() => {
    if (status === "active" && startTimeRef.current) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setCountdown(elapsed);
      }, 200);
    }
    return () => clearInterval(timerRef.current);
  }, [status]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (status === "done" || status === "idle") startTest();
      }
      if (e.key === "Escape") resetTest();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [status, startTest, resetTest]);

  const avgWpm = history.length ? Math.round(history.reduce((s, h) => s + h.wpm, 0) / history.length) : 0;
  const avgAcc = history.length ? Math.round(history.reduce((s, h) => s + h.accuracy, 0) / history.length) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-vault-ink">Typing Speed Test</h1>
          <p className="mt-1 text-vault-muted">Luyện đánh máy tiếng Anh — Ctrl+Enter để bắt đầu, Esc để reset</p>
        </div>
        <div className="flex gap-2">
          <button onClick={startTest} className="focus-ring flex items-center gap-2 rounded-xl bg-vault-purple px-4 py-2.5 text-sm font-bold text-white">
            <Zap size={16} />
            {status === "idle" ? "Bắt đầu" : "Làm lại"}
          </button>
          <button onClick={resetTest} className="focus-ring flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-vault-ink hover:bg-slate-50">
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="subtle-card flex items-center gap-3 px-4 py-3">
          <Clock className="text-vault-purple" size={20} />
          <div>
            <p className="text-2xl font-black text-vault-ink">{countdown}s</p>
            <p className="text-xs text-vault-muted">Thời gian</p>
          </div>
        </div>
        <div className="subtle-card flex items-center gap-3 px-4 py-3">
          <Target className="text-vault-mint" size={20} />
          <div>
            <p className="text-2xl font-black text-vault-ink">{stats ? stats.wpm : 0}</p>
            <p className="text-xs text-vault-muted">WPM</p>
          </div>
        </div>
        <div className="subtle-card flex items-center gap-3 px-4 py-3">
          <Trophy className="text-amber-500" size={20} />
          <div>
            <p className="text-2xl font-black text-vault-ink">{stats ? stats.accuracy : 0}%</p>
            <p className="text-xs text-vault-muted">Accuracy</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-vault-muted">Gõ đoạn văn sau:</p>
        <div className="min-h-[80px] rounded-xl bg-slate-50 p-4 font-mono text-lg leading-relaxed tracking-wide">{chars}</div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-vault-muted">
            {inputLength} / {charCount} ký tự
          </span>
          <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-vault-purple transition-all duration-200" style={{ width: `${Math.min(100, (inputLength / charCount) * 100)}%` }} />
          </div>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          disabled={status === "done"}
          placeholder={status === "done" ? "Hoàn thành!" : "Nhấn Bắt đầu rồi bắt đầu gõ..."}
          className="focus-ring mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-base text-vault-ink placeholder:text-slate-300 focus:border-vault-purple focus:outline-none disabled:opacity-50"
          autoFocus
        />
      </div>

      {stats && (
        <div className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-vault-ink">Kết quả</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-vault-purple/10 p-4 text-center">
              <p className="text-3xl font-black text-vault-purple">{stats.wpm}</p>
              <p className="text-sm font-semibold text-vault-muted">WPM</p>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 text-center">
              <p className="text-3xl font-black text-blue-600">{stats.accuracy}%</p>
              <p className="text-sm font-semibold text-vault-muted">Accuracy</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-3xl font-black text-emerald-600">{stats.correctWords}/{stats.totalWords}</p>
              <p className="text-sm font-semibold text-vault-muted">Từ đúng</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <p className="text-3xl font-black text-amber-600">{stats.timeSeconds}s</p>
              <p className="text-sm font-semibold text-vault-muted">Thời gian</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-vault-muted">
            {stats.wpm >= 60 ? (
              <span className="text-vault-mint">Tuyệt vời! WPM 60+ là tốc độ chuyên nghiệp.</span>
            ) : stats.wpm >= 40 ? (
              <span className="text-blue-600">Khá tốt! Tiếp tục luyện tập để cải thiện.</span>
            ) : (
              <span className="text-amber-600">Cần cải thiện. Hãy thử lại và tập trung vào tốc độ.</span>
            )}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-vault-ink">Lịch sử ({history.length} bài)</h2>
            <div className="flex gap-3 text-sm font-bold">
              <span className="text-vault-purple">TB WPM: {avgWpm}</span>
              <span className="text-vault-mint">TB Acc: {avgAcc}%</span>
            </div>
          </div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-vault-muted">#{history.length - i}</span>
                  <span className="font-semibold text-vault-ink">{h.wpm} WPM</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-vault-mint">
                    <CheckCircle size={14} /> {h.correctWords}/{h.totalWords}
                  </span>
                  <span className="font-semibold text-blue-600">{h.accuracy}%</span>
                  <span className="text-vault-muted">{h.timeSeconds}s</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
