import { useState } from "react";
import PartCard from "../components/PartCard.jsx";
import ProfilePanel from "../components/ProfilePanel.jsx";
import { getProgressSnapshot } from "../utils/progress";
import { addPartSession } from "../utils/storage";

export default function Parts() {
  const [version, setVersion] = useState(0);
  const [skill, setSkill] = useState("Listening");
  const snapshot = getProgressSnapshot();
  const filtered = snapshot.partStats.filter((part) => skill === "All" || part.skill === skill);
  const focusPart = snapshot.partStats.find((part) => part.id === snapshot.profile.focusPart);

  const practice = (partId) => {
    addPartSession(partId, 10);
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Listening TOEIC</h1>
          <p className="text-vault-muted">Luyện nghe Part 1-4 với chiến lược, transcript và kỹ thuật làm bài hiệu quả.</p>
        </div>
        {focusPart && (
          <div className="subtle-card px-4 py-3">
            <p className="text-xs font-bold uppercase text-vault-muted">Trọng tâm hiện tại</p>
            <p className="font-black text-vault-purple">{focusPart.number} - {focusPart.title}</p>
          </div>
        )}
      </header>

      <ProfilePanel />

      <div className="flex flex-wrap gap-2">
        {[
          ["Listening", "Part 1-4"],
          ["All", "Tất cả Part"],
          ["Grammar", "Part 5"],
          ["Reading", "Part 6-7"],
        ].map(([value, label]) => (
          <button key={value} onClick={() => setSkill(value)} className={`focus-ring rounded-xl px-4 py-2 font-bold ${skill === value ? "bg-vault-purple text-white" : "bg-white text-vault-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((part) => <PartCard key={`${part.id}-${version}`} part={part} onPractice={practice} />)}
      </div>
    </div>
  );
}
