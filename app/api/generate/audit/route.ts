import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { entreprise, secteur, answers } = await req.json();

    const prompt = `Tu es un consultant en stratégie digitale senior, expert du secteur "${secteur}".

Analyse la maturité digitale de l'entreprise "${entreprise}" selon ces réponses :
- Site web : ${answers.site}
- Réseaux sociaux : ${answers.reseaux}
- Avis Google : ${answers.avis}
- Acquisition clients : ${answers.prospect}
- Budget marketing : ${answers.budget}

Génère un audit complet et personnalisé. Réponds UNIQUEMENT avec un JSON valide, sans markdown :
{
  "score": <nombre entre 0 et 100>,
  "synthese": "Synthèse en 2-3 phrases, personnalisée pour cette entreprise et ce secteur",
  "points_forts": ["Point fort 1 spécifique", "Point fort 2", "Point fort 3"],
  "axes_amelioration": ["Axe 1 concret et actionnable", "Axe 2", "Axe 3"],
  "plan_action": [
    { "priorite": "URGENT", "action": "Action concrète et précise", "impact": "Impact attendu mesurable" },
    { "priorite": "IMPORTANT", "action": "Action concrète", "impact": "Impact attendu" },
    { "priorite": "MOYEN TERME", "action": "Action concrète", "impact": "Impact attendu" }
  ],
  "potentiel": "Description du potentiel de croissance digitale spécifique à ce profil (2-3 phrases encourageantes et chiffrées si possible)"
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(text.trim());

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Audit generate error:", err);
    return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
  }
}
