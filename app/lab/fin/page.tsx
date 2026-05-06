export default function FinPage() {
  return (
    <main className="min-h-screen bg-[#060612] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c2ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-lg w-full text-center relative z-10">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-8">
          <span className="font-syne font-black text-2xl tracking-tight text-white">ADOWE</span>
          <span className="px-2 py-0.5 bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] rounded text-white text-xs font-syne font-bold tracking-widest">LAB</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00c2ff]/20 to-[#8b5cf6]/20 border border-[#00c2ff]/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="text-4xl">✅</span>
        </div>

        <h1 className="font-syne font-black text-3xl text-white mb-2">Session terminée !</h1>
        <p className="text-[#00c2ff] font-inter text-sm mb-6">Un récapitulatif complet vient d&apos;être envoyé à votre email.</p>

        <p className="text-slate-400 text-base font-inter leading-relaxed mb-8">
          Vous venez de voir en 15 minutes ce que l&apos;IA peut faire pour votre entreprise.<br/>
          <strong className="text-white">Imaginez les résultats sur 12 mois avec ADOWE.</strong>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { num: "48h", label: "Délai de mise en place" },
            { num: "3×", label: "Plus de visibilité en ligne" },
            { num: "24/7", label: "Votre chatbot IA actif" },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-3">
              <div className="font-syne font-black text-2xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] bg-clip-text text-transparent">{s.num}</div>
              <div className="text-slate-500 text-xs font-inter mt-1 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ce qu'on peut faire */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6 text-left">
          <p className="text-[#00c2ff] text-xs font-syne font-bold uppercase tracking-wider mb-3">Ce qu&apos;ADOWE fait pour vous</p>
          <ul className="space-y-2">
            {[
              "Chatbot IA intégré sur votre site en 24h",
              "Pack marketing complet prêt à l'emploi",
              "Séquences email automatisées pour convertir",
              "Audit digital + stratégie sur mesure",
              "Site vitrine optimisé SEO livré en 48h",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-300 text-sm font-inter">
                <span className="text-[#00c2ff] shrink-0">→</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA principal */}
        <a
          href="https://adowe.fr/#contact"
          className="block w-full py-4 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-base hover:opacity-90 transition-all shadow-[0_0_40px_rgba(0,194,255,0.3)] mb-3"
        >
          Discuter de mon projet avec ADOWE →
        </a>

        <a
          href="https://adowe.fr"
          target="_blank"
          className="block w-full py-3 rounded-xl border border-white/15 text-slate-400 font-syne font-semibold text-sm hover:text-white hover:border-white/30 transition-all mb-6"
        >
          Découvrir adowe.fr
        </a>

        <a href="/" className="text-slate-600 hover:text-slate-400 text-sm font-inter transition-colors">
          Refaire une session →
        </a>
      </div>
    </main>
  );
}
