import { useMemo, useState } from "react";
import CollocationCard from "../components/CollocationCard.jsx";
import collocations from "../data/collocations.json";
import { STORAGE_KEYS, getArray, toggleId } from "../utils/storage";

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
      <header><h1 className="text-3xl font-black">Cụm từ</h1><p className="text-vault-muted">Luyện các cách kết hợp từ tự nhiên, rất hữu ích cho TOEIC.</p></header>
      <div className="card grid gap-3 p-4 sm:grid-cols-2">
        <select value={topic} onChange={(event) => setTopic(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">{topics.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={day} onChange={(event) => setDay(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">{days.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {filtered.map((item) => <CollocationCard key={item.id} item={item} learned={learned.includes(item.id)} onLearned={mark} />)}
      </div>
    </div>
  );
}
