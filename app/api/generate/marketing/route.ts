import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { entreprise, secteur, description } = await req.json();

    const prompt = `Tu es un expert LinkedIn et marketing digital pour le secteur "${secteur}".
Crée un pack marketing pour "${entreprise}" : ${description}

IMPORTANT : chaque post LinkedIn doit faire EXACTEMENT 200 mots minimum. Compte bien les mots.

Réponds en JSON uniquement :
{
  "tagline": "Slogan percutant max 10 mots",
  "linkedin": [
    "Post LinkedIn 1 COMPLET (200 mots minimum) : commence par une accroche choc sur une ligne seule, saute une ligne, développe avec une histoire personnelle ou anecdote du secteur, chiffres concrets, paragraphes courts, termine par une question pour engager la communauté. 5 hashtags professionnels à la fin.",
    "Post LinkedIn 2 COMPLET (200 mots minimum) : angle conseil pratique, titre accrocheur, liste de 3 à 5 conseils numérotés avec explication pour chacun, conclusion avec call-to-action. Emojis, 5 hashtags.",
    "Post LinkedIn 3 COMPLET (200 mots minimum) : format témoignage client fictif réaliste, présente le problème du client, la solution apportée, le résultat chiffré, citation du client entre guillemets, conclusion et call-to-action. Emojis, 5 hashtags."
  ],
  "email": "Objet: [objet accrocheur]\n\n[Corps email 150 mots avec appel à l'action]",
  "gmb": "Description Google My Business 120 mots avec mots-clés secteur et appel à l'action"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content || "{}";
    const result = JSON.parse(text);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Marketing error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
