import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 50000 });
  try {
    const { entreprise, secteur, description } = await req.json();

    const prompt = `Tu es un expert en marketing digital pour le secteur "${secteur}".
Génère un pack marketing pour "${entreprise}" : ${description}

JSON uniquement, sans markdown :
{
  "tagline": "Slogan percutant max 10 mots",
  "linkedin": ["Post LinkedIn 1 avec émojis et hashtags (150 mots)", "Post LinkedIn 2 angle différent (150 mots)", "Post LinkedIn 3 angle différent (150 mots)"],
  "email": "Email prospection avec objet en première ligne 'Objet: ...' puis corps (150 mots)",
  "gmb": "Description Google My Business 100 mots avec mots-clés secteur"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1500,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content || "{}";
    const result = JSON.parse(text);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Marketing generate error:", err);
    return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
  }
}
