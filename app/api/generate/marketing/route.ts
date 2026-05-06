import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { entreprise, secteur, description } = await req.json();

    const prompt = `Tu es un expert LinkedIn et marketing digital pour le secteur "${secteur}".
Crée un pack marketing complet et professionnel pour "${entreprise}" : ${description}

Réponds en JSON uniquement :
{
  "tagline": "Slogan percutant et mémorable, max 10 mots",
  "linkedin": [
    "Post LinkedIn 1 : storytelling émotionnel, commence par une accroche forte, développe en 200 mots avec des chiffres concrets, se termine par une question engageante. Utilise des emojis et 5 hashtags professionnels.",
    "Post LinkedIn 2 : angle conseil/expertise, partage 3 conseils pratiques du secteur, 200 mots, ton professionnel et chaleureux, emojis, 5 hashtags.",
    "Post LinkedIn 3 : témoignage ou cas client fictif mais réaliste, résultat chiffré, 200 mots, call-to-action clair, emojis, 5 hashtags."
  ],
  "email": "Objet: [objet accrocheur]\n\nCorps de l'email de prospection en 150 mots, personnalisé, professionnel, avec appel à l'action clair",
  "gmb": "Description Google My Business 120 mots avec mots-clés du secteur et appel à l'action"
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
