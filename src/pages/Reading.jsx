import { useMemo, useState } from "react";
import readings from "../data/readings.json";
import vocabulary from "../data/vocabulary.json";
import { STORAGE_KEYS, getArray, toggleId } from "../utils/storage";

const extractToeicSignals = (content) => {
  const text = content.toLowerCase();
  const matches = vocabulary
    .filter((word) => text.includes(word.word.toLowerCase()))
    .slice(0, 12)
    .map((word) => ({ word: word.word, meaning: word.meaning, collocations: word.collocations.slice(0, 2) }));
  const paraphrases = [
    ["purchase order", "order form"],
    ["delay shipment", "postpone delivery"],
    ["make a decision", "decide"],
    ["confirm a reservation", "verify a booking"],
    ["increase profit", "improve earnings"],
  ].filter(([a, b]) => text.includes(a.split(" ")[0]) || text.includes(b.split(" ")[0]));
  return { matches, paraphrases };
};

export default function Reading() {
  const [version, setVersion] = useState(0);
  const completed = getArray(STORAGE_KEYS.completedReadings);
  const extractions = useMemo(() => Object.fromEntries(readings.map((reading) => [reading.id, extractToeicSignals(reading.content)])), []);
  const mark = (id) => {
    toggleId(STORAGE_KEYS.completedReadings, id);
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Reading TOEIC</h1>
        <p className="text-vault-muted">Làm chủ Part 5-7 với các dạng câu hỏi, paraphrase và kỹ thuật đọc hiểu.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="subtle-card p-4"><p className="text-sm font-bold text-vault-muted">Part 5</p><p className="font-black text-vault-ink">Incomplete Sentences</p></div>
        <div className="subtle-card p-4"><p className="text-sm font-bold text-vault-muted">Part 6</p><p className="font-black text-vault-ink">Text Completion</p></div>
        <div className="subtle-card p-4"><p className="text-sm font-bold text-vault-muted">Part 7</p><p className="font-black text-vault-ink">Reading Comprehension</p></div>
      </div>
      <div className="grid gap-5">
        {readings.map((reading) => {
          const done = completed.includes(reading.id);
          const extracted = extractions[reading.id];
          return (
            <article key={`${reading.id}-${version}`} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="font-bold text-vault-purple">Ngày {reading.day} - {reading.level}</p><h2 className="text-2xl font-black">{reading.title}</h2></div>
                <button onClick={() => mark(reading.id)} className={`focus-ring rounded-xl px-4 py-2 font-bold ${done ? "bg-vault-mint text-white" : "bg-vault-purple/10 text-vault-purple"}`}>{done ? "Đã đọc" : "Đánh dấu đã đọc"}</button>
              </div>
              <p className="mt-5 leading-8 text-vault-ink">{reading.content}</p>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl bg-blue-50 p-4">
                  <h3 className="font-black text-blue-900">Từ/cụm TOEIC trong bài</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[...new Set([...reading.vocabulary, ...extracted.matches.map((item) => item.word)])].slice(0, 12).map((word) => <span key={`${reading.id}-${word}`} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-blue-700">{word}</span>)}
                  </div>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <h3 className="font-black text-emerald-900">Paraphrase / collocation</h3>
                  <div className="mt-3 space-y-2 text-sm text-emerald-900/80">
                    {extracted.paraphrases.map(([a, b]) => <p key={a}><span className="font-bold">{a}</span> = {b}</p>)}
                    {extracted.matches.slice(0, 3).map((item) => <p key={item.word}><span className="font-bold">{item.word}</span>: {item.collocations.join(", ")}</p>)}
                    {!extracted.paraphrases.length && !extracted.matches.length && <p>Chưa tìm thấy pattern rõ. Hãy tự thêm vào sổ tay nếu gặp paraphrase mới.</p>}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
