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
      <header><h1 className="text-3xl font-black">Ngữ pháp</h1><p className="text-vault-muted">Học cấu trúc, dấu hiệu nhận biết, ví dụ và lỗi sai thường gặp.</p></header>
      <div className="grid gap-5">
        {grammar.map((lesson) => <GrammarCard key={lesson.id} lesson={lesson} completed={completed.includes(lesson.id)} onComplete={mark} />)}
      </div>
    </div>
  );
}
