import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Resend } from "resend";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 50000 });
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { entreprise, secteur, offre, cible, email } = await req.json();

    const prompt = `Expert email marketing "${secteur}". Séquence 3 emails pour "${entreprise}", offre: ${offre}. ${cible ? `Cible: ${cible}` : ""}

JSON uniquement:
{
  "emails": [
    {"subject": "Objet email 1", "body": "Corps email bienvenue 120 mots"},
    {"subject": "Objet email 2 relance J+3", "body": "Corps relance 100 mots"},
    {"subject": "Objet email 3 offre finale J+7", "body": "Corps offre finale 100 mots"}
  ]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1000,
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
        html: `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <p style="background:#f8fafc;border-radius:8px;padding:12px;font-size:12px;color:#94a3b8;">🧪 Email de démonstration généré par ADOWE Lab pour ${entreprise}.</p>
          <pre style="white-space:pre-wrap;font-size:14px;line-height:1.8;color:#334155;">${emails[0].body}</pre>
          <p style="font-size:11px;color:#94a3b8;margin-top:24px;">Généré par ADOWE Lab · demo.adowe.fr</p>
        </div>`,
      });
      sent = true;
    } catch (e) {
      console.error("Email send error:", e);
    }

    return NextResponse.json({ emails, sent });
  } catch (err) {
    console.error("Sequence generate error:", err);
    return NextResponse.json({ error: "Erreur de génération" }, { status: 500 });
  }
}
