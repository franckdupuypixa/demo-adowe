import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { entreprise, secteur, answers } = await req.json();

    const prompt = `Consultant digital "${secteur}". Maturité digitale "${entreprise}": site=${answers.site}, réseaux=${answers.reseaux}, avis=${answers.avis}, clients=${answers.prospect}, budget=${answers.budget}

JSON uniquement:
{"score":75,"synthese":"2 phrases","points_forts":["p1","p2","p3"],"axes_amelioration":["a1","a2","a3"],"plan_action":[{"priorite":"URGENT","action":"action","impact":"impact"},{"priorite":"IMPORTANT","action":"action","impact":"impact"},{"priorite":"MOYEN TERME","action":"action","impact":"impact"}],"potentiel":"2 phrases"}`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 700,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content || "{}";
    const result = JSON.parse(text);
    return NextResponse.json({ result });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
