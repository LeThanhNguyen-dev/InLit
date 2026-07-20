import { useMemo, useState } from "react";
import CollocationCard from "../components/CollocationCard.jsx";
import vocabulary from "../data/vocabulary.json";
import { STORAGE_KEYS, getArray, toggleId } from "../utils/storage";

const collocations = vocabulary
  .filter((item) => item.learningType === "collocation")
  .map((item) => ({
    id: item.id,
    phrase: item.word,
    meaning: item.meaning,
    example: item.example,
    topic: item.topic,
    day: item.day,
  }));

export default function Collocations() {
  const [version, setVersion] = useState(0);
  const [topic, setTopic] = useState("All");
  const [day, setDay] = useState("All");
  const learned = getArray(STORAGE_KEYS.learnedCollocations);
  const topics = ["All", ...new Set(collocations.map((item) => item.topic))];
  const days = ["All", ...new Set(collocations.map((item) => item.day))];
  const filtered = useMemo(() => collocations.filter((item) => (topic === "All" || item.topic === topic) && (day === "All" || item.day === Number(day))), [topic, day, version]);

  const mark = (id) => {
    toggleId(STORAGE_KEYS.learnedCollocations, id);
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Collocations TOEIC</h1>
        <p className="text-vault-muted">700 cụm từ TOEIC được tách từ bộ Vocabulary TOEIC 700 để học riêng theo chủ đề và ngày.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="subtle-card p-4">
          <p className="text-sm font-bold text-vault-muted">Tổng collocations</p>
          <p className="text-3xl font-black text-vault-ink">{collocations.length}</p>
        </div>
        <div className="subtle-card p-4">
          <p className="text-sm font-bold text-vault-muted">Ngày bắt đầu</p>
          <p className="text-3xl font-black text-vault-ink">{Math.min(...collocations.map((item) => item.day))}</p>
        </div>
        <div className="subtle-card p-4">
          <p className="text-sm font-bold text-vault-muted">Ngày kết thúc</p>
          <p className="text-3xl font-black text-vault-ink">{Math.max(...collocations.map((item) => item.day))}</p>
        </div>
      </div>
      <div className="card grid gap-3 p-4 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold text-vault-muted">
          Chủ đề
          <select value={topic} onChange={(event) => setTopic(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-vault-ink">{topics.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-vault-muted">
          Ngày
          <select value={day} onChange={(event) => setDay(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-vault-ink">{days.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((item) => <CollocationCard key={item.id} item={item} learned={learned.includes(item.id)} onLearned={mark} />)}
      </div>
    </div>
  );
}
