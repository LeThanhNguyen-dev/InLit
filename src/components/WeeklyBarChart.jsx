import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { weeklyProgress } from "../utils/progress";

export default function WeeklyBarChart({ height = 192 }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return undefined;
    const update = () => setWidth(Math.max(260, Math.floor(ref.current.getBoundingClientRect().width)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [height]);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      {width > 0 ? (
        <BarChart data={weeklyProgress()} width={width} height={height}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="progress" fill="#6d5dfc" radius={[8, 8, 0, 0]} />
        </BarChart>
      ) : (
        <div className="h-full w-full rounded-xl bg-slate-50" />
      )}
    </div>
  );
}
