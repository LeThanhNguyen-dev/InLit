import { Eye, EyeOff, Headphones, RotateCcw } from "lucide-react";
import { useState } from "react";
import readings from "../data/readings.json";

const sentences = readings.flatMap((reading) =>
  reading.content.split(/(?<=[.!?])\s+/).map((text, index) => ({
    id: `${reading.id}-${index}`,
    title: reading.title,
    text,
  }))
);

export default function Shadowing() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const current = sentences[index % sentences.length];

  const next = () => {
    setShow(false);
    setIndex((value) => (value + 1) % sentences.length);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-3xl font-black">Shadowing Mode</h1>
        <p className="text-vault-muted">Workflow nghe-nhắc lại local-only: nhìn tiêu đề, tự đọc/nghe, sau đó mở transcript và đánh dấu câu khó.</p>
      </header>
      <div className="card p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-vault-purple">{current.title}</p>
            <p className="text-sm text-vault-muted">Câu {index + 1} / {sentences.length}</p>
          </div>
          <Headphones className="text-vault-purple" />
        </div>
        <div className="mt-6 grid min-h-56 place-items-center rounded-2xl bg-blue-50 p-8 text-center">
          {show ? (
            <p className="text-3xl font-black leading-snug text-vault-ink">{current.text}</p>
          ) : (
            <div>
              <p className="text-xl font-black text-vault-ink">Tự nói lại câu theo trí nhớ</p>
              <p className="mt-2 text-vault-muted">Sau 2-3 giây hãy bấm hiện transcript.</p>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <button onClick={() => setShow((value) => !value)} className="focus-ring flex items-center gap-2 rounded-xl bg-vault-purple px-5 py-3 font-bold text-white">
            {show ? <EyeOff size={18} /> : <Eye size={18} />} {show ? "Ẩn transcript" : "Hiện transcript"}
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShow(false)} className="focus-ring flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 font-bold text-vault-ink"><RotateCcw size={18} /> Lặp lại</button>
            <button onClick={next} className="focus-ring rounded-xl bg-vault-mint px-5 py-3 font-bold text-white">Câu tiếp</button>
          </div>
        </div>
      </div>
    </div>
  );
}
