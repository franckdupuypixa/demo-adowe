import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const { entreprise, secteur, description } = await req.json();

    const prompt = `Tu es un expert en marketing digital pour les entreprises du secteur "${secteur}".

Génère un pack marketing complet et professionnel pour l'entreprise "${entreprise}".

Description de leur activité : ${description}

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans code block, exactement dans ce format :
{
  "tagline": "Un slogan court et percutant (max 10 mots)",
  "linkedin": [
    "Post LinkedIn 1 (200-250 mots, accrocheur, avec émojis, hashtags à la fin)",
    "Post LinkedIn 2 (200-250 mots, différent angle, avec émojis, hashtags à la fin)",
    "Post LinkedIn 3 (200-250 mots, encore différent, avec émojis, hashtags à la fin)"
  ],
  "email": "Email de prospection complet (Objet inclus en première ligne commençant par 'Objet : ', puis le corps, 200-250 mots, professionnel et chaleureux)",
  "gmb": "Description Google My Business (150-200 mots, inclut les mots-clés du secteur, appel à l'action)"
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const result = JSON.parse(text.trim());

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Marketing generate error:", err);
    return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
  }
}
