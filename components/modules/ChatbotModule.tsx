"use client";
import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "assistant"; content: string }

export default function ChatbotModule({ entreprise, secteur, onComplete }: { entreprise: string; secteur: string; onComplete?: () => void }) {
  const [config, setConfig] = useState({ botName: "", activite: "", faq1: "", faq2: "", faq3: "" });
  const [configured, setConfigured] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const configure = () => {
    if (!config.botName || !config.activite) return;
    const sp = `Tu es ${config.botName}, l'assistant virtuel de ${entreprise}, une entreprise du secteur ${secteur}.
Activité précise : ${config.activite}.
${config.faq1 ? `FAQ 1 : ${config.faq1}` : ""}
${config.faq2 ? `FAQ 2 : ${config.faq2}` : ""}
${config.faq3 ? `FAQ 3 : ${config.faq3}` : ""}
Réponds toujours en français, de façon professionnelle et chaleureuse, en moins de 150 mots.
Si on te demande quelque chose en dehors de ton domaine, redirige poliment vers l'équipe.`;
    setSystemPrompt(sp);
    setMessages([{ role: "assistant", content: `Bonjour ! Je suis ${config.botName}, votre assistant ${entreprise}. Comment puis-je vous aider ?` }]);
    setConfigured(true);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, systemPrompt }),
    });
    const data = await res.json();
    setMessages(m => [...m, { role: "assistant", content: data.reply }]);
    setLoading(false);
    onComplete?.();
  };

  if (!configured) {
    return (
      <div className="space-y-5">
        <p className="text-slate-400 text-sm font-inter leading-relaxed">
          Configurez votre chatbot en 30 secondes et testez-le en direct — exactement comme il apparaîtrait sur votre site.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Nom du bot</label>
            <input
              value={config.botName}
              onChange={e => setConfig(c => ({ ...c, botName: e.target.value }))}
              placeholder="Ex : Sophie, Alex, Max…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/40 transition-colors"
            />
          </div>
          <div>
            <label className="text-[#00c2ff]/70 text-xs font-inter mb-1.5 block">Votre activité précise</label>
            <input
              value={config.activite}
              onChange={e => setConfig(c => ({ ...c, activite: e.target.value }))}
              placeholder="Ex : Rénovation de cuisine haut de gamme"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/40 transition-colors"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[#00c2ff]/70 text-xs font-inter block">Questions fréquentes de vos clients (optionnel)</label>
          {[1, 2, 3].map(n => (
            <input
              key={n}
              value={config[`faq${n}` as keyof typeof config]}
              onChange={e => setConfig(c => ({ ...c, [`faq${n}`]: e.target.value }))}
              placeholder={`Question ${n} : ex "Quels sont vos délais ?"`}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/40 transition-colors"
            />
          ))}
        </div>
        <button
          onClick={configure}
          disabled={!config.botName || !config.activite}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all shadow-[0_0_20px_rgba(0,194,255,0.2)]"
        >
          🤖 Créer mon chatbot et le tester
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00c2ff] to-[#8b5cf6] flex items-center justify-center">
            <span className="text-white text-xs font-bold">{config.botName[0]}</span>
          </div>
          <div>
            <p className="text-white text-sm font-syne font-semibold">{config.botName}</p>
            <p className="text-slate-500 text-xs font-inter">Assistant {entreprise} · En ligne</p>
          </div>
        </div>
        <button onClick={() => setConfigured(false)} className="text-xs text-slate-500 hover:text-slate-300 font-inter transition-colors border border-white/10 rounded-lg px-3 py-1.5">
          Reconfigurer
        </button>
      </div>

      {/* Chat window */}
      <div className="bg-black/20 border border-white/10 rounded-xl h-72 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm font-inter leading-relaxed ${
              m.role === "user"
                ? "bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white rounded-br-sm"
                : "bg-white/[0.06] text-slate-300 rounded-bl-sm border border-white/10"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.06] border border-white/10 px-4 py-2.5 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Posez une question à votre bot…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 font-inter outline-none focus:border-[#00c2ff]/40 transition-colors"
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00c2ff] to-[#8b5cf6] text-white font-syne font-bold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
        >
          →
        </button>
      </div>
      <p className="text-slate-600 text-xs font-inter">Ce chatbot peut être intégré sur votre site en 24h par ADOWE.</p>
    </div>
  );
}
