import { useEffect, useState } from "react";
import { getArray, getObject, STORAGE_KEYS } from "../utils/storage";

const DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const STUDY_START = new Date("2026-05-25T00:00:00");

function toDate(studyDay) {
  const d = new Date(STUDY_START);
  d.setDate(d.getDate() + studyDay - 1);
  return d;
}

export default function StudyCalendar() {
  const [completedDays, setCompletedDays] = useState([]);
  const [streak, setStreak] = useState({ count: 0, lastDate: null });

  useEffect(() => {
    const load = () => {
      setCompletedDays(getArray(STORAGE_KEYS.completedDays));
      setStreak(getObject(STORAGE_KEYS.streak, { count: 0, lastDate: null }));
    };
    load();
    window.addEventListener("englishvault-storage", load);
    return () => window.removeEventListener("englishvault-storage", load);
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const completedDateKeys = new Set(
    completedDays.map((day) => toDate(day).toISOString().slice(0, 10))
  );

  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    const dayKey = date.toISOString().slice(0, 10);
    const isToday = d === today.getDate();
    const isFuture = date > today;
    const isStudied = completedDateKeys.has(dayKey);
    cells.push({ day: d, dayKey, isToday, isFuture, isStudied });
  }

  return (
    <div className="card p-6">
      <h3 className="mb-4 font-bold">
        Lịch học tháng {month + 1}
      </h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAYS.map((day) => (
          <div key={day} className="py-1 font-semibold text-vault-muted">
            {day}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e${i}`} />;
          let cls = "rounded-lg py-1.5 text-sm font-semibold ";
          if (cell.isToday) {
            cls += "ring-2 ring-vault-purple bg-vault-purple/10 text-vault-purple";
          } else if (cell.isStudied) {
            cls += "bg-vault-mint/20 text-vault-mint";
          } else if (!cell.isFuture) {
            cls += "text-vault-muted/40";
          } else {
            cls += "text-vault-muted/20";
          }
          return (
            <div key={cell.dayKey} className={cls}>
              {cell.day}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-vault-muted">
        Streak: <span className="text-vault-ink">{streak.count} ngày</span>
      </p>
    </div>
  );
}
