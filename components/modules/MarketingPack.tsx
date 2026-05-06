"use client";
import { useState } from "react";

interface Result {
  tagline: string;
  linkedin: string[];
  email: string;
  gmb: string;
}

export default function MarketingPack({ entreprise, secteur }: { entreprise: string; secteur: string }) {
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState("");

  const generate = async () => {
    if (!desc.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/generate/marketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entreprise, secteur, description: desc }),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => copy(text, id)}
      className="text-xs text-slate-500 hover:text-[#00c2ff] transition-colors px-2 py-1 rounded border border-white/10 hover:border-[#00c2ff]/30"
    >
      {copied === id ? "✓ Copié" : "Copier"}
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-slate-400 text-sm font-inter mb-4 leading-relaxed">
          Décrivez votre activité en quelques mots — l&apos;IA génère votre pack marketing complet en secondes.
        </p>
        <label className="text-[#00c2ff]/70 text-xs font-inter mb-2 block">Décrivez votre activité / vos services principaux</label>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder={`Ex : Nous sommes une entreprise de ${secteur.toLowerCase()}, spécialisée dans la rénovation de salles de bain haut de gamme pour des clients exigeants...`}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/40 transition-colors resize-none"
        />
        <button
          onClick={generate}
          disabled={loading || !desc.trim()}
          className="mt-3 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              L&apos;IA génère votre pack…
            </span>
          ) : "✨ Générer mon pack marketing"}
        </button>
      </div>

      {result && (
        <div className="space-y-4 pt-2">
          {/* Tagline */}
          <div className="bg-white/[0.03] border border-[#00c2ff]/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#00c2ff] text-xs font-syne font-bold tracking-wider uppercase">Tagline / Slogan</span>
              <CopyBtn text={result.tagline} id="tagline" />
            </div>
            <p className="text-white font-syne font-semibold text-lg leading-snug">&ldquo;{result.tagline}&rdquo;</p>
          </div>

          {/* LinkedIn posts */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <span className="text-[#8b5cf6] text-xs font-syne font-bold tracking-wider uppercase block mb-3">3 Posts LinkedIn prêts à publier</span>
            <div className="space-y-3">
              {result.linkedin.map((post, i) => (
                <div key={i} className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.06]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-slate-300 text-sm font-inter leading-relaxed whitespace-pre-wrap flex-1">{post}</p>
                    <CopyBtn text={post} id={`linkedin${i}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email de prospection */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#00c2ff] text-xs font-syne font-bold tracking-wider uppercase">Email de prospection</span>
              <CopyBtn text={result.email} id="email" />
            </div>
            <p className="text-slate-300 text-sm font-inter leading-relaxed whitespace-pre-wrap">{result.email}</p>
          </div>

          {/* Google My Business */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#00c2ff] text-xs font-syne font-bold tracking-wider uppercase">Description Google My Business</span>
              <CopyBtn text={result.gmb} id="gmb" />
            </div>
            <p className="text-slate-300 text-sm font-inter leading-relaxed">{result.gmb}</p>
          </div>

          <p className="text-slate-600 text-xs font-inter">
            ✓ Tout le contenu ci-dessus est 100% personnalisé pour <strong className="text-slate-500">{entreprise}</strong>. Copiez et utilisez directement.
          </p>
        </div>
      )}
    </div>
  );
}
