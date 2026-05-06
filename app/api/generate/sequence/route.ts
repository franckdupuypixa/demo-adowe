import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { entreprise, secteur, offre, cible, email } = await req.json();

    const prompt = `Email marketing "${secteur}". 3 emails pour "${entreprise}", offre: ${offre}${cible ? `, cible: ${cible}` : ""}.

JSON uniquement:
{"emails":[{"subject":"objet1","body":"corps email bienvenue 80 mots"},{"subject":"objet2 relance J+3","body":"corps relance 70 mots"},{"subject":"objet3 offre finale J+7","body":"corps offre finale 70 mots"}]}`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 800,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content || "{}";
    const { emails } = JSON.parse(text);

    let sent = false;
    try {
      await resend.emails.send({
        from: "ADOWE Lab <onboarding@resend.dev>",
        to: email,
        subject: `[Démonstration ADOWE Lab] ${emails[0].subject}`,
        html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;"><p style="background:#f8fafc;border-radius:8px;padding:12px;font-size:12px;color:#94a3b8;">🧪 Email de démonstration ADOWE Lab pour ${entreprise}.</p><pre style="white-space:pre-wrap;font-size:14px;line-height:1.8;color:#334155;">${emails[0].body}</pre></div>`,
      });
      sent = true;
    } catch (e) { console.error("Email error:", e); }

    return NextResponse.json({ emails, sent });
  } catch (err) {
    console.error("Sequence error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
