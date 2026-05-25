import { useState } from "react";
import readings from "../data/readings.json";
import { STORAGE_KEYS, getArray, toggleId } from "../utils/storage";

export default function Reading() {
  const [version, setVersion] = useState(0);
  const completed = getArray(STORAGE_KEYS.completedReadings);
  const mark = (id) => {
    toggleId(STORAGE_KEYS.completedReadings, id);
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-black">Đọc hiểu</h1><p className="text-vault-muted">Các đoạn đọc ngắn kèm danh sách từ cần chú ý.</p></header>
      <div className="grid gap-5">
        {readings.map((reading) => {
          const done = completed.includes(reading.id);
          return (
            <article key={reading.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="font-bold text-vault-purple">Ngày {reading.day} • {reading.level}</p><h2 className="text-2xl font-black">{reading.title}</h2></div>
                <button onClick={() => mark(reading.id)} className={`focus-ring rounded-xl px-4 py-2 font-bold ${done ? "bg-vault-mint text-white" : "bg-vault-purple/10 text-vault-purple"}`}>{done ? "Đã đọc" : "Đánh dấu đã đọc"}</button>
              </div>
              <p className="mt-5 leading-8 text-vault-ink">{reading.content}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {reading.vocabulary.map((word) => <span key={word} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{word}</span>)}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
