"use client";
import { useState } from "react";

const QUESTIONS = [
  {
    key: "reseaux",
    label: "Vos réseaux sociaux",
    sublabel: "Une présence active sur LinkedIn ou Instagram crée de la confiance et attire des clients.",
    options: ["Actif — je poste régulièrement", "Présent mais peu actif (moins d'1 post/mois)", "Absent des réseaux sociaux"],
  },
  {
    key: "avis",
    label: "Vos avis Google",
    sublabel: "80% des clients lisent les avis avant de contacter une entreprise.",
    options: ["+20 avis positifs sur Google", "Quelques avis (moins de 10)", "Pas d'avis ou fiche Google non réclamée"],
  },
  {
    key: "prospect",
    label: "Comment vous trouvez vos clients",
    sublabel: "Dépendre uniquement du bouche-à-oreille limite fortement votre croissance.",
    options: ["Uniquement par bouche-à-oreille", "Mélange bouche-à-oreille et digital", "Principalement via Google / publicité en ligne"],
  },
  {
    key: "budget",
    label: "Votre investissement marketing",
    sublabel: "Les entreprises qui investissent dans leur visibilité digitale croissent 2x plus vite.",
    options: ["0€ — je n'investis pas dans le marketing", "Moins de 500€/mois", "Plus de 500€/mois"],
  },
];

interface AuditResult {
  score: number;
  synthese: string;
  points_forts: string[];
  axes_amelioration: string[];
  plan_action: { priorite: string; action: string; impact: string }[];
  potentiel: string;
}

export default function BusinessAudit({ entreprise, secteur, siteUrl, onComplete }: { entreprise: string; secteur: string; siteUrl: string; onComplete?: (result: AuditResult) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const allAnswered = QUESTIONS.every(q => answers[q.key]);

  const generate = async () => {
    if (!allAnswered) return;
    setLoading(true);
    const res = await fetch("/api/generate/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entreprise, secteur, answers, siteUrl }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
    onComplete?.(data.result);
  };

  const scoreColor = (s: number) => s >= 70 ? "text-green-400" : s >= 40 ? "text-yellow-400" : "text-red-400";
  const scoreBg = (s: number) => s >= 70 ? "from-green-500/20 to-green-500/5 border-green-500/20" : s >= 40 ? "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20" : "from-red-500/20 to-red-500/5 border-red-500/20";

  return (
    <div className="space-y-5">
      <div className="bg-white/[0.03] border border-[#00c2ff]/20 rounded-xl p-4 mb-2">
        <p className="text-white text-sm font-syne font-semibold mb-1">Comment fonctionne cet audit ?</p>
        <p className="text-slate-400 text-sm font-inter leading-relaxed">
          Répondez à 4 questions sur votre situation actuelle. L&apos;IA calcule votre <strong className="text-white">score de visibilité digitale</strong> sur 100 et génère un plan d&apos;action personnalisé concret.
        </p>
        {siteUrl && (
          <div className="flex items-center gap-2 mt-3 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
            <p className="text-green-400 text-xs font-inter">Votre site <strong>{siteUrl}</strong> sera analysé automatiquement</p>
          </div>
        )}
      </div>

      {!result ? (
        <>
          <div className="space-y-4">
            {QUESTIONS.map((q, i) => (
              <div key={q.key} className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-4">
                <p className="text-white text-sm font-inter font-medium mb-1">
                  <span className="text-[#00c2ff]/50 mr-2 font-mono">{i + 1}.</span>{q.label}
                </p>
                <p className="text-slate-500 text-xs font-inter mb-3 ml-5">{q.sublabel}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setAnswers(a => ({ ...a, [q.key]: opt }))}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-inter text-left transition-all border ${
                        answers[q.key] === opt
                          ? "bg-[#00c2ff]/15 border-[#00c2ff]/40 text-white"
                          : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                      }`}
                    >
                      {answers[q.key] === opt && <span className="text-[#00c2ff] mr-1">✓</span>}{opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={loading || !allAnswered}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Analyse en cours…
              </span>
            ) : "📊 Analyser ma maturité digitale"}
          </button>
        </>
      ) : (
        <div className="space-y-4">
          {/* Site analysé */}
          {siteUrl && (
            <div className="flex items-center gap-2 bg-[#00c2ff]/10 border border-[#00c2ff]/20 rounded-xl px-4 py-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              <p className="text-[#00c2ff] text-xs font-inter">
                Analyse basée sur le contenu réel de <strong>{siteUrl}</strong>
              </p>
            </div>
          )}

          {/* Score */}
          <div className={`bg-gradient-to-br ${scoreBg(result.score)} border rounded-xl p-5 text-center`}>
            <p className="text-slate-400 text-xs font-inter mb-2 uppercase tracking-wider">Score de maturité digitale</p>
            <div className={`text-6xl font-syne font-black ${scoreColor(result.score)} mb-1`}>{result.score}<span className="text-2xl">/100</span></div>
            <p className="text-slate-300 text-sm font-inter mt-3 leading-relaxed">{result.synthese}</p>
          </div>

          {/* Points forts */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <p className="text-green-400 text-xs font-syne font-bold uppercase tracking-wider mb-3">✓ Points forts</p>
            <ul className="space-y-1.5">
              {result.points_forts.map((p, i) => (
                <li key={i} className="text-slate-300 text-sm font-inter flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>{p}
                </li>
              ))}
            </ul>
          </div>

          {/* Axes d'amélioration */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <p className="text-yellow-400 text-xs font-syne font-bold uppercase tracking-wider mb-3">⚡ Axes d&apos;amélioration</p>
            <ul className="space-y-1.5">
              {result.axes_amelioration.map((a, i) => (
                <li key={i} className="text-slate-300 text-sm font-inter flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">→</span>{a}
                </li>
              ))}
            </ul>
          </div>

          {/* Plan d'action */}
          <div className="bg-white/[0.03] border border-[#8b5cf6]/20 rounded-xl p-4">
            <p className="text-[#8b5cf6] text-xs font-syne font-bold uppercase tracking-wider mb-3">🎯 Plan d&apos;action recommandé</p>
            <div className="space-y-3">
              {result.plan_action.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/[0.03] rounded-lg p-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                    item.priorite === "URGENT" ? "bg-red-500/20 text-red-400" :
                    item.priorite === "IMPORTANT" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>{item.priorite}</span>
                  <div>
                    <p className="text-white text-sm font-inter font-medium">{item.action}</p>
                    <p className="text-slate-500 text-xs font-inter mt-0.5">Impact attendu : {item.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#00c2ff]/10 to-[#8b5cf6]/10 border border-[#00c2ff]/20 rounded-xl p-4">
            <p className="text-white font-syne font-semibold text-sm mb-1">Potentiel identifié</p>
            <p className="text-slate-300 text-sm font-inter leading-relaxed">{result.potentiel}</p>
          </div>

          <button onClick={() => setResult(null)} className="text-xs text-slate-500 hover:text-slate-300 font-inter transition-colors">
            ← Refaire l&apos;audit
          </button>
        </div>
      )}
    </div>
  );
}
