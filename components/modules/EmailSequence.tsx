"use client";
import { useState } from "react";

interface EmailResult {
  subject: string;
  body: string;
}

export default function EmailSequence({ email, entreprise, secteur }: { email: string; entreprise: string; secteur: string }) {
  const [offre, setOffre] = useState("");
  const [cible, setCible] = useState("");
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<EmailResult[] | null>(null);
  const [sent, setSent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const generate = async () => {
    if (!offre.trim()) return;
    setLoading(true);
    setEmails(null);
    setSent(false);
    const res = await fetch("/api/generate/sequence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entreprise, secteur, offre, cible, email }),
    });
    const data = await res.json();
    setEmails(data.emails);
    setSent(data.sent);
    setLoading(false);
  };

  const TABS = ["Email 1 — Bienvenue", "Email 2 — Relance", "Email 3 — Offre finale"];

  return (
    <div className="space-y-5">
      <p className="text-slate-400 text-sm font-inter leading-relaxed">
        L&apos;IA génère une séquence de 3 emails automatisés pour convertir vos prospects. Le premier vous sera envoyé directement pour que vous le viviez en tant que client.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Votre offre / service à promouvoir</label>
          <textarea
            value={offre}
            onChange={e => setOffre(e.target.value)}
            placeholder="Ex : Rénovation complète de salle de bain, devis gratuit en 48h, garantie 2 ans…"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/40 transition-colors resize-none"
          />
        </div>
        <div>
          <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Votre cible client (optionnel)</label>
          <textarea
            value={cible}
            onChange={e => setCible(e.target.value)}
            placeholder="Ex : Propriétaires de maison entre 40-60 ans, budget moyen/haut de gamme, région parisienne…"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/40 transition-colors resize-none"
          />
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading || !offre.trim()}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Génération de la séquence…
          </span>
        ) : "📧 Générer ma séquence email automatisée"}
      </button>

      {emails && (
        <div className="space-y-3">
          {sent && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
              <p className="text-green-400 text-sm font-inter">
                ✓ L&apos;email de bienvenue a été envoyé à <strong>{email}</strong> — vérifiez votre boîte !
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 text-xs font-syne font-semibold transition-colors border-b-2 -mb-px ${
                  activeTab === i
                    ? "text-[#00c2ff] border-[#00c2ff]"
                    : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <p className="text-[#00c2ff]/70 text-xs font-inter mb-1">Objet</p>
            <p className="text-white font-syne font-semibold mb-4">{emails[activeTab]?.subject}</p>
            <p className="text-[#00c2ff]/70 text-xs font-inter mb-1">Corps de l&apos;email</p>
            <p className="text-slate-300 text-sm font-inter leading-relaxed whitespace-pre-wrap">{emails[activeTab]?.body}</p>
          </div>

          <p className="text-slate-600 text-xs font-inter">
            Ces 3 emails peuvent être automatisés via un outil CRM ou Mailchimp et envoyés à vos prospects sur 7 jours.
          </p>
        </div>
      )}
    </div>
  );
}
