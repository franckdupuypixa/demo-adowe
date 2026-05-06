export default function FinPage() {
  return (
    <main className="min-h-screen bg-[#060612] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c2ff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-lg w-full text-center relative z-10">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-8">
          <span className="font-syne font-black text-2xl tracking-tight text-white">ADOWE</span>
          <span className="px-2 py-0.5 bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] rounded text-white text-xs font-syne font-bold tracking-widest">LAB</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00c2ff]/20 to-[#8b5cf6]/20 border border-[#00c2ff]/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⏱</span>
        </div>

        <h1 className="font-syne font-black text-3xl text-white mb-3">Votre session est terminée</h1>
        <p className="text-slate-400 text-base font-inter leading-relaxed mb-8">
          Vous venez de vivre ce que l&apos;IA peut faire pour votre entreprise en seulement 15 minutes.<br />
          Imaginez ce qu&apos;ADOWE peut construire pour vous sur le long terme.
        </p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 text-left">
          <p className="text-[#00c2ff] text-xs font-syne font-bold uppercase tracking-wider mb-4">Ce que nous pouvons faire pour vous</p>
          <ul className="space-y-3">
            {[
              "Chatbot IA personnalisé intégré sur votre site",
              "Séquences email automatisées pour convertir vos prospects",
              "Stratégie de contenu LinkedIn et Google My Business",
              "Audit complet et plan digital sur mesure",
              "Site vitrine optimisé SEO livré en 48h",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm font-inter">
                <span className="text-[#00c2ff] mt-0.5 shrink-0">→</span>{item}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="https://adowe.fr/#contact"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-base hover:opacity-90 transition-all shadow-[0_0_40px_rgba(0,194,255,0.3)] mb-4"
        >
          Discuter de mon projet avec ADOWE →
        </a>

        <div className="block mt-3">
          <a href="/" className="text-slate-600 hover:text-slate-400 text-sm font-inter transition-colors">
            Refaire une session →
          </a>
        </div>
      </div>
    </main>
  );
}
