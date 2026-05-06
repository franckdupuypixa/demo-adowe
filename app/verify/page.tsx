"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigit = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setCode(text.split(""));
      inputs.current[5]?.focus();
    }
  };

  const submit = async () => {
    const inputCode = code.join("");
    if (inputCode.length !== 6) { setError("Entrez les 6 chiffres."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: inputCode }),
    });
    const data = await res.json();
    if (data.ok) {
      router.push("/lab");
    } else {
      setError(data.message || "Code incorrect ou expiré. Réessayez.");
      setLoading(false);
    }
  };

  const resend = async () => {
    await fetch("/api/register/resend", { method: "POST" });
    setResent(true);
    setTimeout(() => setResent(false), 30000);
  };

  return (
    <main className="min-h-screen bg-[#060612] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00c2ff]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 text-center">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 mb-8">
          <span className="font-syne font-black text-2xl tracking-tight text-white">ADOWE</span>
          <span className="px-2 py-0.5 bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] rounded text-white text-xs font-syne font-bold tracking-widest">LAB</span>
        </div>

        {/* Email icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00c2ff]/20 to-[#8b5cf6]/20 border border-[#00c2ff]/30 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00c2ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>

        <h1 className="font-syne font-bold text-2xl text-white mb-2">Vérifiez votre email</h1>
        <p className="text-slate-400 text-sm font-inter mb-8 leading-relaxed">
          Nous venons d&apos;envoyer un code à 6 chiffres à votre adresse email.<br />
          Saisissez-le ci-dessous pour accéder au Lab.
        </p>

        {/* Code inputs */}
        <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-syne font-bold text-white bg-white/5 border rounded-xl outline-none transition-all ${
                digit ? "border-[#00c2ff]/60 bg-[#00c2ff]/10" : "border-white/15 focus:border-[#00c2ff]/40"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-xs font-inter bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        <button
          onClick={submit}
          disabled={loading || code.join("").length !== 6}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_30px_rgba(0,194,255,0.25)] mb-4"
        >
          {loading ? "Vérification…" : "Accéder au Lab →"}
        </button>

        <button
          onClick={resend}
          disabled={resent}
          className="text-slate-500 hover:text-slate-300 text-xs font-inter transition-colors disabled:opacity-50"
        >
          {resent ? "✓ Code renvoyé !" : "Renvoyer le code"}
        </button>

        <div className="mt-6">
          <a href="/" className="text-slate-600 hover:text-slate-400 text-xs font-inter transition-colors">
            ← Recommencer l&apos;inscription
          </a>
        </div>
      </div>
    </main>
  );
}
