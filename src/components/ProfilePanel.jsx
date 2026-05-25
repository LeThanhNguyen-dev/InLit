import { Save } from "lucide-react";
import { useState } from "react";
import parts from "../data/parts.json";
import { getProfile, saveProfile } from "../utils/storage";

export default function ProfilePanel({ compact = false }) {
  const [profile, setProfile] = useState(getProfile());
  const [saved, setSaved] = useState(false);

  const update = (field, value) => {
    setSaved(false);
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const submit = () => {
    saveProfile({ ...profile, dailyMinutes: Number(profile.dailyMinutes) || 30 });
    setSaved(true);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-vault-ink">Hồ sơ học cá nhân</h2>
          <p className="text-sm text-vault-muted">Chỉ lưu trên trình duyệt này.</p>
        </div>
        {saved && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Đã lưu</span>}
      </div>
      <div className={`mt-5 grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
        <input value={profile.name} onChange={(event) => update("name", event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3" placeholder="Tên của bạn" />
        <input value={profile.level} onChange={(event) => update("level", event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3" placeholder="Trình độ hiện tại" />
        <input value={profile.dailyMinutes} onChange={(event) => update("dailyMinutes", event.target.value)} type="number" min="5" className="focus-ring rounded-xl border border-slate-200 px-4 py-3" placeholder="Số phút/ngày" />
        <select value={profile.focusPart} onChange={(event) => update("focusPart", event.target.value)} className="focus-ring rounded-xl border border-slate-200 px-4 py-3">
          {parts.map((part) => <option key={part.id} value={part.id}>{part.number} - {part.title}</option>)}
        </select>
        <textarea value={profile.goal} onChange={(event) => update("goal", event.target.value)} rows={compact ? 3 : 4} className="focus-ring rounded-xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Mục tiêu học của bạn" />
      </div>
      <button onClick={submit} className="focus-ring mt-4 flex items-center gap-2 rounded-xl bg-vault-purple px-5 py-3 font-bold text-white">
        <Save size={18} /> Lưu hồ sơ
      </button>
    </div>
  );
}
