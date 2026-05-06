"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SECTEURS = [
  "Habitat / Bâtiment / Rénovation",
  "Architecture / Design d'intérieur",
  "Décoration / Aménagement",
  "Immobilier",
  "Artisanat / Métiers du bâtiment",
  "Commerce / Retail",
  "Santé / Bien-être",
  "Restauration / Hôtellerie",
  "Services aux entreprises",
  "Autre",
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", entreprise: "", secteur: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prenom || !form.nom || !form.email || !form.entreprise || !form.secteur) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/verify");
    } else {
      setError("Une erreur est survenue. Réessayez.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#060612] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c2ff]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="font-syne font-black text-2xl tracking-tight text-white">ADOWE</span>
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] rounded text-white text-xs font-syne font-bold tracking-widest">LAB</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-[#00c2ff]/10 border border-[#00c2ff]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#00c2ff] rounded-full animate-pulse" />
            <span className="text-[#00c2ff] text-xs font-inter font-medium tracking-wide">Expérience IA en direct · 15 minutes</span>
          </div>
          <h1 className="font-syne font-bold text-2xl text-white mb-2">Bienvenue dans le Lab</h1>
          <p className="text-slate-400 text-sm font-inter leading-relaxed">
            Testez en direct ce que l&apos;IA peut faire pour votre entreprise.<br />
            Inscription rapide — un code vous sera envoyé par email.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 backdrop-blur-sm shadow-[0_0_80px_rgba(0,194,255,0.06)]">
          <form onSubmit={submit} className="flex flex-col gap-4">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Prénom</label>
                <input
                  value={form.prenom}
                  onChange={e => set("prenom", e.target.value)}
                  placeholder="Jean"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Nom</label>
                <input
                  value={form.nom}
                  onChange={e => set("nom", e.target.value)}
                  placeholder="Dupont"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/50 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Email professionnel</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="jean@monentreprise.fr"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/50 transition-colors"
              />
            </div>

            {/* Entreprise */}
            <div>
              <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Nom de votre entreprise</label>
              <input
                value={form.entreprise}
                onChange={e => set("entreprise", e.target.value)}
                placeholder="Mon Entreprise SARL"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/50 transition-colors"
              />
            </div>

            {/* Secteur */}
            <div>
              <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Secteur d&apos;activité</label>
              <select
                value={form.secteur}
                onChange={e => set("secteur", e.target.value)}
                className="w-full bg-[#0d0d24] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-inter outline-none focus:border-[#00c2ff]/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled>Choisissez votre secteur…</option>
                {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-inter bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_30px_rgba(0,194,255,0.25)]"
            >
              {loading ? "Envoi du code…" : "Démarrer mon expérience →"}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs font-inter mt-5">
          Vos données sont utilisées uniquement pour cette session · ADOWE
        </p>
      </div>
    </main>
  );
}
