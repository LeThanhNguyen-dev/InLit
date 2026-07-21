import { useState } from "react";
import { Bookmark, Download, Trash2, Eye, EyeOff } from "lucide-react";
import vocabulary from "../data/vocabulary.json";
import { STORAGE_KEYS, getArray, toggleId, exportVaultData } from "../utils/storage";

export default function Bookmarks() {
  const [version, setVersion] = useState(0);
  const [showMeaning, setShowMeaning] = useState(true);
  const bookmarks = getArray(STORAGE_KEYS.bookmarks);
  const words = vocabulary.filter((w) => bookmarks.includes(w.id));

  const removeBookmark = (id) => {
    toggleId(STORAGE_KEYS.bookmarks, id);
    setVersion((v) => v + 1);
  };

  const clearAll = () => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify([]));
    setVersion((v) => v + 1);
  };

  const handleExport = () => {
    const data = exportVaultData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `englishvault-bookmarks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (words.length === 0) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-black text-vault-ink">Bookmarks</h1>
          <p className="text-vault-muted">Từ vựng đã đánh dấu để ôn lại nhanh.</p>
        </header>
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-vault-purple/10 text-vault-purple">
            <Bookmark size={32} />
          </div>
          <p className="mt-5 text-lg font-bold text-vault-ink">Chưa có bookmark nào</p>
          <p className="mt-2 max-w-sm text-sm text-vault-muted">Hãy nhấn nút Bookmark trên bất kỳ từ vựng nào để lưu lại và ôn lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-vault-ink">Bookmarks</h1>
          <p className="text-vault-muted">{words.length} từ đã đánh dấu — ôn lại nhanh những từ quan trọng.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowMeaning((v) => !v)} className="focus-ring flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-vault-ink">
            {showMeaning ? <EyeOff size={17} /> : <Eye size={17} />}
            {showMeaning ? "Ẩn nghĩa" : "Hiện nghĩa"}
          </button>
          <button onClick={handleExport} className="focus-ring flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-vault-ink">
            <Download size={17} /> Export
          </button>
          <button onClick={clearAll} className="focus-ring flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">
            <Trash2 size={17} /> Xóa tất cả
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {words.map((word) => (
          <article key={word.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-vault-ink">{word.word}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-vault-muted">{word.type}</span>
                </div>
                <p className="text-sm text-vault-muted">{word.pronunciation}</p>
              </div>
              <span className="rounded-full bg-vault-purple/10 px-3 py-1 text-xs font-bold text-vault-purple">Ngày {word.day}</span>
            </div>

            {showMeaning ? (
              <>
                <p className="mt-4 text-base font-semibold text-vault-ink">{word.meaning}</p>
                <p className="mt-2 text-sm text-vault-muted">{word.example}</p>
                {word.exampleVi && <p className="text-sm text-vault-muted">{word.exampleVi}</p>}
                {word.collocations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {word.collocations.map((c) => (
                      <span key={c} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{c}</span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center text-sm text-vault-muted italic">
                Nhấn "Ẩn nghĩa" để tự ôn trước khi xem đáp án
              </div>
            )}

            <button onClick={() => removeBookmark(word.id)} className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-vault-ink hover:bg-red-50 hover:text-red-600">
              <Trash2 size={15} /> Bỏ bookmark
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
