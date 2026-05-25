import { useMemo, useState } from "react";
import VocabularyCard from "../components/VocabularyCard.jsx";
import vocabulary from "../data/vocabulary.json";
import { STORAGE_KEYS, getArray, toggleId } from "../utils/storage";

export default function Vocabulary() {
  const [version, setVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [level, setLevel] = useState("All");
  const [day, setDay] = useState("All");
  const learned = getArray(STORAGE_KEYS.learnedWords);
  const difficult = getArray(STORAGE_KEYS.difficultWords);
  const topics = ["All", ...new Set(vocabulary.map((word) => word.topic))];
  const levels = ["All", ...new Set(vocabulary.map((word) => word.level))];
  const days = ["All", ...new Set(vocabulary.map((word) => word.day))];

  const filtered = useMemo(() => vocabulary.filter((word) => {
    const matchesSearch = [word.word, word.meaning, word.example].join(" ").toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (topic === "All" || word.topic === topic) && (level === "All" || word.level === level) && (day === "All" || word.day === Number(day));
  }), [search, topic, level, day, version]);

  const toggle = (key, id) => {
    toggleId(key, id);
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Từ vựng</h1>
        <p className="text-vault-muted">Tìm kiếm, lọc theo chủ đề/ngày và lưu trạng thái học trên máy của bạn.</p>
      </header>
      <div className="card grid gap-3 p-4 md:grid-cols-4">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm từ hoặc nghĩa" className="focus-ring rounded-xl border border-slate-200 px-4 py-3 md:col-span-1" />
        <select value={topic} onChange={(event) => setTopic(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">{topics.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={level} onChange={(event) => setLevel(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">{levels.map((item) => <option key={item}>{item}</option>)}</select>
        <select value={day} onChange={(event) => setDay(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">{days.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((word) => (
          <VocabularyCard key={word.id} word={word} learned={learned.includes(word.id)} difficult={difficult.includes(word.id)} onLearned={(id) => toggle(STORAGE_KEYS.learnedWords, id)} onDifficult={(id) => toggle(STORAGE_KEYS.difficultWords, id)} />
        ))}
      </div>
    </div>
  );
}
