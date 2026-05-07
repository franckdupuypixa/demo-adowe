import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { entreprise, secteur, description } = await req.json();

    const prompt = `Expert marketing "${secteur}". Pack pour "${entreprise}" : ${description}

JSON uniquement :
{
  "tagline": "Slogan 8 mots max",
  "linkedin": [
    "Post LinkedIn 1 (130 mots) : accroche choc 1 ligne, saut de ligne, storytelling secteur, chiffre concret, question finale, 3 hashtags",
    "Post LinkedIn 2 (130 mots) : angle conseil, 3 conseils numérotés, call-to-action, 3 hashtags",
    "Post LinkedIn 3 (130 mots) : témoignage client fictif, problème→solution→résultat chiffré, citation, 3 hashtags"
  ],
  "email": "Objet: [accrocheur]\n\n[Corps 80 mots, call-to-action]",
  "gmb": "Description GMB 80 mots, mots-clés secteur, call-to-action"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 1200,
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
