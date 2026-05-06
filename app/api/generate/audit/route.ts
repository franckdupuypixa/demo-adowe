import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 50000 });
  try {
    const { entreprise, secteur, answers } = await req.json();

    const prompt = `Consultant digital expert "${secteur}". Analyse maturité digitale de "${entreprise}":
- Site: ${answers.site} | Réseaux: ${answers.reseaux} | Avis Google: ${answers.avis} | Clients: ${answers.prospect} | Budget: ${answers.budget}

JSON uniquement:
{
  "score": <0-100>,
  "synthese": "2 phrases personnalisées",
  "points_forts": ["Point 1", "Point 2", "Point 3"],
  "axes_amelioration": ["Axe 1", "Axe 2", "Axe 3"],
  "plan_action": [
    {"priorite": "URGENT", "action": "Action précise", "impact": "Impact mesurable"},
    {"priorite": "IMPORTANT", "action": "Action précise", "impact": "Impact"},
    {"priorite": "MOYEN TERME", "action": "Action précise", "impact": "Impact"}
  ],
  "potentiel": "2 phrases sur le potentiel de croissance"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 800,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content || "{}";
    const result = JSON.parse(text);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Audit generate error:", err);
    return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
  }
}
