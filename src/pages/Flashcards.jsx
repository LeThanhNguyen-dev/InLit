import { useMemo, useState } from "react";
import Flashcard from "../components/Flashcard.jsx";
import vocabulary from "../data/vocabulary.json";
import { currentStudyDay } from "../utils/progress";
import { dueVocabulary } from "../utils/spacedRepetition";
import { STORAGE_KEYS, getArray, getObject, reviewWord, toggleId } from "../utils/storage";

export default function Flashcards() {
  const [version, setVersion] = useState(0);
  const [mode, setMode] = useState("day");
  const [day, setDay] = useState(currentStudyDay());
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const learned = getArray(STORAGE_KEYS.learnedWords);
  const difficult = getArray(STORAGE_KEYS.difficultWords);
  const reviews = getObject(STORAGE_KEYS.wordReviews, {});
  const days = [...new Set(vocabulary.map((word) => word.day))];
  const cards = useMemo(() => dueVocabulary(vocabulary, difficult, learned, mode, day, reviews), [mode, day, version]);
  const word = cards[index % Math.max(cards.length, 1)];

  const mark = (key, id) => {
    toggleId(key, id);
    setVersion((value) => value + 1);
  };
  const review = (id, quality) => {
    reviewWord(id, quality);
    if (quality !== "again" && !learned.includes(id)) toggleId(STORAGE_KEYS.learnedWords, id);
    setVersion((value) => value + 1);
    move(1);
  };
  const move = (amount) => {
    setFlipped(false);
    setIndex((value) => (cards.length ? (value + amount + cards.length) % cards.length : 0));
  };

  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-black">Flashcard</h1><p className="text-vault-muted">Mỗi ngày scan 20 từ/cụm: học kỹ 12 core words, lướt nhanh 8 từ đã biết.</p></header>
      <div className="card flex flex-wrap items-center gap-3 p-4">
        <select value={day} onChange={(event) => { setDay(Number(event.target.value)); setIndex(0); }} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 font-bold">
          {days.map((item) => <option key={item} value={item}>Ngày {item} - {vocabulary.find((word) => word.day === item)?.set}</option>)}
        </select>
        {[
          ["day", "Theo ngày"],
          ["review", "Cần ôn"],
          ["difficult", "Từ khó"],
          ["learned", "Đã học"],
          ["all", "Tất cả"],
        ].map(([value, label]) => (
          <button key={value} onClick={() => { setMode(value); setIndex(0); }} className={`focus-ring rounded-xl px-4 py-2 font-bold ${mode === value ? "bg-vault-purple text-white" : "bg-white text-vault-ink"}`}>{label}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="subtle-card p-4"><p className="text-sm text-vault-muted">Bộ hiện tại</p><p className="font-black">Ngày {day}</p></div>
        <div className="subtle-card p-4"><p className="text-sm text-vault-muted">Số thẻ</p><p className="font-black">{cards.length}</p></div>
        <div className="subtle-card p-4"><p className="text-sm text-vault-muted">Đến hạn ôn</p><p className="font-black">{dueVocabulary(vocabulary, difficult, learned, "review", day, reviews).length}</p></div>
        <div className="subtle-card p-4"><p className="text-sm text-vault-muted">Từ khó</p><p className="font-black">{difficult.length}</p></div>
      </div>
      <Flashcard
        word={word}
        flipped={flipped}
        onFlip={() => setFlipped((value) => !value)}
        onPrev={() => move(-1)}
        onNext={() => move(1)}
        onLearned={(id) => mark(STORAGE_KEYS.learnedWords, id)}
        onDifficult={(id) => mark(STORAGE_KEYS.difficultWords, id)}
        onReview={review}
        learned={word && learned.includes(word.id)}
        difficult={word && difficult.includes(word.id)}
        review={word && reviews[word.id]}
      />
      <p className="text-center text-sm font-semibold text-vault-muted">{cards.length ? `${index + 1} / ${cards.length}` : "0 / 0"}</p>
    </div>
  );
}
