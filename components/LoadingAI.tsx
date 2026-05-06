"use client";
import { useEffect, useState } from "react";

export default function LoadingAI({ messages }: { messages: string[] }) {
  const [index, setIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setIndex(i => (i + 1) % messages.length);
    }, 1800);
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".");
    }, 400);
    return () => { clearInterval(msgInterval); clearInterval(dotInterval); };
  }, [messages]);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Orbe animé */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#8b5cf6] opacity-20 animate-ping" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#8b5cf6] opacity-30 animate-pulse" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_30px_rgba(0,194,255,0.4)]">
          <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3"/>
            <path className="opacity-90" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      </div>

      {/* Message courant */}
      <div className="text-center">
        <p className="text-white font-syne font-semibold text-sm">
          {messages[index]}{dots}
        </p>
        <p className="text-slate-500 text-xs font-inter mt-1">Intelligence Artificielle en action</p>
      </div>

      {/* Barre de progression animée */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] rounded-full animate-[loading_2s_ease-in-out_infinite]"
          style={{ animation: "loading 2s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
