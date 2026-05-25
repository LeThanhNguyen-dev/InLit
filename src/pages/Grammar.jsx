import { useState } from "react";
import GrammarCard from "../components/GrammarCard.jsx";
import grammar from "../data/grammar.json";
import { STORAGE_KEYS, getArray, toggleId } from "../utils/storage";

export default function Grammar() {
  const [version, setVersion] = useState(0);
  const completed = getArray(STORAGE_KEYS.completedGrammar);
  const mark = (id) => {
    toggleId(STORAGE_KEYS.completedGrammar, id);
    setVersion((value) => value + 1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black">Grammar TOEIC</h1>
        <p className="text-vault-muted">Nắm vững 38 chủ đề ngữ pháp trọng tâm trong đề thi, kèm lỗi thường gặp và cách áp dụng.</p>
      </header>
      <div className="subtle-card p-4">
        <p className="text-sm font-bold text-vault-muted">Chủ đề ngữ pháp trọng tâm</p>
        <p className="text-3xl font-black text-vault-ink">{grammar.length}</p>
      </div>
      <div className="grid gap-5">
        {grammar.map((lesson) => <GrammarCard key={`${lesson.id}-${version}`} lesson={lesson} completed={completed.includes(lesson.id)} onComplete={mark} />)}
      </div>
    </div>
  );
}
