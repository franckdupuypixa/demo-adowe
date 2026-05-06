"use client";
import { useState } from "react";
import Timer from "@/components/Timer";
import MarketingPack from "@/components/modules/MarketingPack";
import ChatbotModule from "@/components/modules/ChatbotModule";
import EmailSequence from "@/components/modules/EmailSequence";
import BusinessAudit from "@/components/modules/BusinessAudit";

const MODULES = [
  {
    id: "marketing",
    icon: "🏭",
    label: "Pack Marketing",
    sublabel: "Tagline · LinkedIn · Email · GMB",
    color: "#00c2ff",
  },
  {
    id: "chatbot",
    icon: "🤖",
    label: "Chatbot IA",
    sublabel: "Configurez et testez en direct",
    color: "#8b5cf6",
  },
  {
    id: "email",
    icon: "📧",
    label: "Séquence Email",
    sublabel: "3 emails automatisés",
    color: "#00c2ff",
  },
  {
    id: "audit",
    icon: "📊",
    label: "Audit Digital",
    sublabel: "Score + plan d'action",
    color: "#8b5cf6",
  },
];

interface Props {
  startTime: number;
  userData: Record<string, string>;
}

export default function LabClient({ startTime, userData }: Props) {
  const [activeModule, setActiveModule] = useState("marketing");

  const { prenom, entreprise, secteur, email } = userData;

  return (
    <div className="min-h-screen bg-[#060612] flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#00c2ff]/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-[#8b5cf6]/[0.04] rounded-full blur-[150px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#060612]/90 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-syne font-black text-lg tracking-tight text-white">ADOWE</span>
            <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] rounded text-white text-[10px] font-syne font-bold tracking-widest">LAB</span>
          </div>

          {/* Session info */}
          <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">{prenom?.[0]}</span>
            </div>
            <span className="text-slate-400 text-xs font-inter">{prenom} · <span className="text-slate-500">{secteur?.split("/")[0].trim()}</span></span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3">
            <Timer startTime={startTime} />
            <a
              href="https://adowe.fr/#contact"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white text-xs font-syne font-bold hover:opacity-90 transition-all"
            >
              Prendre RDV →
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 relative z-10">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-syne font-bold text-xl text-white mb-1">
            Bienvenue dans le Lab, <span className="bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] bg-clip-text text-transparent">{prenom}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm font-inter">
            {entreprise} · Testez librement les 4 modules IA ci-dessous pendant votre session.
          </p>
        </div>

        {/* Module selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`group relative p-4 rounded-xl border text-left transition-all ${
                activeModule === m.id
                  ? "border-[#00c2ff]/40 bg-[#00c2ff]/[0.08] shadow-[0_0_20px_rgba(0,194,255,0.1)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
              }`}
            >
              {activeModule === m.id && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00c2ff]" />
              )}
              <span className="text-2xl block mb-2">{m.icon}</span>
              <p className={`font-syne font-bold text-sm ${activeModule === m.id ? "text-white" : "text-slate-300"}`}>{m.label}</p>
              <p className="text-slate-600 text-[10px] font-inter mt-0.5 leading-tight">{m.sublabel}</p>
            </button>
          ))}
        </div>

        {/* Active module */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 sm:p-7 shadow-[0_0_60px_rgba(0,194,255,0.04)]">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.07]">
            <span className="text-3xl">{MODULES.find(m => m.id === activeModule)?.icon}</span>
            <div>
              <h2 className="font-syne font-bold text-lg text-white">{MODULES.find(m => m.id === activeModule)?.label}</h2>
              <p className="text-slate-500 text-xs font-inter">{MODULES.find(m => m.id === activeModule)?.sublabel}</p>
            </div>
          </div>

          {activeModule === "marketing" && <MarketingPack entreprise={entreprise} secteur={secteur} />}
          {activeModule === "chatbot" && <ChatbotModule entreprise={entreprise} secteur={secteur} />}
          {activeModule === "email" && <EmailSequence email={email} entreprise={entreprise} secteur={secteur} />}
          {activeModule === "audit" && <BusinessAudit entreprise={entreprise} secteur={secteur} />}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 bg-gradient-to-r from-[#00c2ff]/10 to-[#8b5cf6]/10 border border-white/10 rounded-2xl p-6 text-center">
          <p className="text-white font-syne font-bold text-lg mb-2">Vous voulez tout ça pour votre entreprise ?</p>
          <p className="text-slate-400 text-sm font-inter mb-4">ADOWE met en place ces solutions en moins de 48h. Parlons de votre projet.</p>
          <a
            href="https://adowe.fr/#contact"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold hover:opacity-90 transition-all shadow-[0_0_30px_rgba(0,194,255,0.25)]"
          >
            Prendre RDV avec ADOWE →
          </a>
        </div>
      </main>
    </div>
  );
}
