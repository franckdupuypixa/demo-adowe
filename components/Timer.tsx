"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Timer({ startTime }: { startTime: number }) {
  const router = useRouter();
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const SESSION = 15 * 60 * 1000;
    const tick = () => {
      const left = Math.max(0, SESSION - (Date.now() - startTime));
      setMs(left);
      if (left === 0) router.push("/lab/fin");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startTime, router]);

  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const urgent = ms < 120000;
  const pct = Math.max(0, (ms / (15 * 60 * 1000)) * 100);

  return (
    <div className="flex items-center gap-3">
      {/* Arc progress */}
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
          <circle
            cx="16" cy="16" r="12" fill="none"
            stroke={urgent ? "#ef4444" : "#00c2ff"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 12}`}
            strokeDashoffset={`${2 * Math.PI * 12 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
          />
        </svg>
      </div>
      <div className={`font-mono text-lg font-bold tabular-nums ${urgent ? "text-red-400" : "text-white"}`}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </div>
    </div>
  );
}
