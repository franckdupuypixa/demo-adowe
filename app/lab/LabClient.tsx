"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Timer from "@/components/Timer";
import MarketingPack from "@/components/modules/MarketingPack";
import ChatbotModule from "@/components/modules/ChatbotModule";
import EmailSequence from "@/components/modules/EmailSequence";
import BusinessAudit from "@/components/modules/BusinessAudit";

const MODULES = [
  { id: "marketing", icon: "🏭", label: "Pack Marketing", sublabel: "Tagline · LinkedIn · Email · GMB" },
  { id: "chatbot",   icon: "🤖", label: "Chatbot IA",     sublabel: "Configurez et testez en direct" },
  { id: "email",     icon: "📧", label: "Séquence Email", sublabel: "3 emails automatisés" },
  { id: "audit",     icon: "📊", label: "Audit Digital",  sublabel: "Score + plan d'action" },
];

interface Props {
  startTime: number;
  userData: Record<string, string>;
}

export default function LabClient({ startTime, userData }: Props) {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState("marketing");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [sending, setSending] = useState(false);
  const [recapSent, setRecapSent] = useState(false);

  const { prenom, entreprise, secteur, email, siteUrl } = userData;

  const onModuleComplete = useCallback((moduleId: string, result: unknown) => {
    setCompleted(c => ({ ...c, [moduleId]: true }));
    setResults(r => ({ ...r, [moduleId]: result }));
  }, []);

  const sendRecapAndRedirect = useCallback(async () => {
    if (recapSent) { router.push("/lab/fin"); return; }
    setSending(true);
    try {
      await fetch("/api/send-recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData, results }),
      });
    } catch { /* silent */ }
    setRecapSent(true);
    setSending(false);
    router.push("/lab/fin");
  }, [recapSent, userData, results, router]);

  const completedCount = Object.keys(completed).length;

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
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-syne font-black text-lg tracking-tight text-white">ADOWE</span>
            <span className="px-1.5 py-0.5 bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] rounded text-white text-[10px] font-syne font-bold tracking-widest">LAB</span>
          </div>

          {/* Progression */}
          <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5">
            <div className="flex gap-1">
              {MODULES.map(m => (
                <div key={m.id} className={`w-2 h-2 rounded-full transition-all ${completed[m.id] ? "bg-[#00c2ff]" : "bg-white/15"}`} />
              ))}
            </div>
            <span className="text-slate-400 text-xs font-inter">{completedCount}/4 modules</span>
          </div>

          <div className="flex items-center gap-3">
            <Timer startTime={startTime} onExpire={sendRecapAndRedirect} />
            <button
              onClick={sendRecapAndRedirect}
              disabled={sending}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white text-xs font-syne font-bold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {sending ? "Envoi…" : "Terminer →"}
            </button>
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
            {entreprise} · Testez les 4 modules IA — un récap vous sera envoyé par email à la fin.
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
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
              }`}
            >
              {/* Checkmark si complété */}
              {completed[m.id] && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00c2ff] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
              )}
              {!completed[m.id] && activeModule === m.id && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#00c2ff]" />
              )}
              <span className="text-2xl block mb-2">{m.icon}</span>
              <p className={`font-syne font-bold text-sm ${activeModule === m.id ? "text-white" : "text-slate-300"}`}>{m.label}</p>
              <p className="text-slate-600 text-[10px] font-inter mt-0.5 leading-tight">{m.sublabel}</p>
            </button>
          ))}
        </div>

        {/* Active module */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 sm:p-7">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.07]">
            <span className="text-3xl">{MODULES.find(m => m.id === activeModule)?.icon}</span>
            <div>
              <h2 className="font-syne font-bold text-lg text-white">{MODULES.find(m => m.id === activeModule)?.label}</h2>
              <p className="text-slate-500 text-xs font-inter">{MODULES.find(m => m.id === activeModule)?.sublabel}</p>
            </div>
            {completed[activeModule] && (
              <span className="ml-auto text-xs text-[#00c2ff] bg-[#00c2ff]/10 border border-[#00c2ff]/20 rounded-full px-3 py-1 font-inter">✓ Complété</span>
            )}
          </div>

          {activeModule === "marketing" && <MarketingPack entreprise={entreprise} secteur={secteur} onComplete={r => onModuleComplete("marketing", r)} />}
          {activeModule === "chatbot"   && <ChatbotModule entreprise={entreprise} secteur={secteur} onComplete={() => onModuleComplete("chatbot", true)} />}
          {activeModule === "email"     && <EmailSequence email={email} entreprise={entreprise} secteur={secteur} onComplete={r => onModuleComplete("email", r)} />}
          {activeModule === "audit"     && <BusinessAudit entreprise={entreprise} secteur={secteur} siteUrl={siteUrl || ""} onComplete={r => onModuleComplete("audit", r)} />}
        </div>

        {/* Footer CTA */}
        <div className="mt-6 bg-gradient-to-r from-[#00c2ff]/10 to-[#8b5cf6]/10 border border-white/10 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-syne font-bold text-base mb-1">Vous voulez tout ça pour votre entreprise ?</p>
              <p className="text-slate-400 text-sm font-inter">ADOWE met en place ces solutions en moins de 48h.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={sendRecapAndRedirect}
                disabled={sending}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm font-syne font-semibold hover:bg-white/5 transition-all disabled:opacity-50"
              >
                {sending ? "Envoi récap…" : "Terminer la session"}
              </button>
              <a
                href="https://adowe.fr/#contact"
                target="_blank"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white text-sm font-syne font-bold hover:opacity-90 transition-all"
              >
                Prendre RDV →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
