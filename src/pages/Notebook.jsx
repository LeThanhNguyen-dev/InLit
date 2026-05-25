import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { STORAGE_KEYS, getArray, setArray } from "../utils/storage";

export default function Notebook() {
  const [notes, setNotes] = useState(getArray(STORAGE_KEYS.notes));
  const [draft, setDraft] = useState({ title: "", type: "Từ vựng", content: "" });

  const save = () => {
    if (!draft.title.trim() && !draft.content.trim()) return;
    const next = [{ ...draft, id: Date.now(), date: new Date().toISOString() }, ...notes];
    setNotes(next);
    setArray(STORAGE_KEYS.notes, next);
    setDraft({ title: "", type: "Từ vựng", content: "" });
  };

  const remove = (id) => {
    const next = notes.filter((note) => note.id !== id);
    setNotes(next);
    setArray(STORAGE_KEYS.notes, next);
  };

  return (
    <div className="space-y-6">
      <header><h1 className="text-3xl font-black">Sổ tay lỗi sai</h1><p className="text-vault-muted">Ghi lại từ khó, lỗi ngữ pháp, lỗi khi làm Prep và câu sửa đúng.</p></header>
      <div className="card grid gap-4 p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Tiêu đề ghi chú" className="focus-ring rounded-xl border border-slate-200 px-4 py-3" />
          <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">
            <option>Từ vựng</option><option>Ngữ pháp</option><option>Đọc hiểu</option><option>Lỗi Prep</option><option>Khác</option>
          </select>
        </div>
        <textarea value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder="Ghi lỗi sai, từ khó, câu sửa đúng..." rows="6" className="focus-ring rounded-xl border border-slate-200 px-4 py-3" />
        <button onClick={save} className="focus-ring flex w-fit items-center gap-2 rounded-xl bg-vault-purple px-5 py-3 font-bold text-white"><Save size={18} /> Lưu ghi chú</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <article key={note.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-sm font-bold text-vault-purple">{note.type}</p><h2 className="text-xl font-black">{note.title || "Ghi chú chưa đặt tên"}</h2></div>
              <button onClick={() => remove(note.id)} className="focus-ring rounded-xl bg-red-50 p-2 text-red-600"><Trash2 size={18} /></button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-vault-muted">{note.content}</p>
          </article>
        ))}
        {notes.length === 0 && <div className="card flex items-center gap-3 p-6 text-vault-muted"><Plus /> Ghi chú đã lưu sẽ xuất hiện ở đây.</div>}
      </div>
    </div>
  );
}
