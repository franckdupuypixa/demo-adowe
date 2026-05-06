import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { entreprise, secteur, description } = await req.json();

    const prompt = `Expert marketing digital secteur "${secteur}". Pack marketing pour "${entreprise}": ${description}

JSON uniquement:
{"tagline":"slogan 8 mots max","linkedin":["post1 100 mots emojis hashtags","post2 100 mots angle different","post3 100 mots angle different"],"email":"Objet: ...\n\nCorps email 100 mots","gmb":"description GMB 80 mots"}`;

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
