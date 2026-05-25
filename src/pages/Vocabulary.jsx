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
  const [group, setGroup] = useState("All");
  const learned = getArray(STORAGE_KEYS.learnedWords);
  const difficult = getArray(STORAGE_KEYS.difficultWords);
  const topics = ["All", ...new Set(vocabulary.map((word) => word.topic))];
  const levels = ["All", ...new Set(vocabulary.map((word) => word.level))];
  const days = ["All", ...new Set(vocabulary.map((word) => word.day))];
  const groups = ["All", ...new Set(vocabulary.map((word) => word.learningGroup).filter(Boolean))];

  const filtered = useMemo(() => vocabulary.filter((word) => {
    const matchesSearch = [word.word, word.meaning, word.example].join(" ").toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (topic === "All" || word.topic === topic) && (level === "All" || word.level === level) && (day === "All" || word.day === Number(day)) && (group === "All" || word.learningGroup === group);
  }), [search, topic, level, day, group, version]);

  const toggle = (key, id) => {
    toggleId(key, id);
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Vocabulary TOEIC</h1>
        <p className="text-vault-muted">Xây dựng vốn từ vựng theo 40 chủ đề TOEIC phổ biến nhất: core words, collocations và phrasal verbs.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="subtle-card p-4">
          <p className="text-sm font-bold text-vault-muted">Core words</p>
          <p className="text-3xl font-black text-vault-ink">2,000</p>
        </div>
        <div className="subtle-card p-4">
          <p className="text-sm font-bold text-vault-muted">Collocations</p>
          <p className="text-3xl font-black text-vault-ink">700</p>
        </div>
        <div className="subtle-card p-4">
          <p className="text-sm font-bold text-vault-muted">Phrasal verbs & phrases</p>
          <p className="text-3xl font-black text-vault-ink">300</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          ["All", "Tất cả"],
          ["Core words", "Core words"],
          ["Collocations", "700 Collocations"],
          ["Phrasal verbs & phrases", "300 Phrasal verbs"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setGroup(value)}
            className={`focus-ring rounded-xl px-4 py-2 text-sm font-bold ${group === value ? "bg-vault-purple text-white" : "bg-white text-vault-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="card grid gap-3 p-4 md:grid-cols-5">
        <label className="grid gap-1 text-xs font-bold text-vault-muted">
          Tìm kiếm
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm từ hoặc nghĩa" className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-vault-ink md:col-span-1" />
        </label>
        <label className="grid gap-1 text-xs font-bold text-vault-muted">
          Nhóm học
          <select value={group} onChange={(event) => setGroup(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-vault-ink">{groups.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-vault-muted">
          Chủ đề
          <select value={topic} onChange={(event) => setTopic(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-vault-ink">{topics.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-vault-muted">
          Cấp độ
          <select value={level} onChange={(event) => setLevel(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-vault-ink">{levels.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="grid gap-1 text-xs font-bold text-vault-muted">
          Ngày
          <select value={day} onChange={(event) => setDay(event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-vault-ink">{days.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((word) => (
          <VocabularyCard key={word.id} word={word} learned={learned.includes(word.id)} difficult={difficult.includes(word.id)} onLearned={(id) => toggle(STORAGE_KEYS.learnedWords, id)} onDifficult={(id) => toggle(STORAGE_KEYS.difficultWords, id)} />
        ))}
      </div>
    </div>
  );
}
