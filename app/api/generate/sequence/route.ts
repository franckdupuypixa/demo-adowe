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
        subject: emails[0].subject,
        html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;">

          <!-- Header bannière démo -->
          <div style="background:linear-gradient(135deg,#0a0f2e,#0f1a3d);padding:14px 24px;text-align:center;">
            <span style="display:inline-flex;align-items:center;gap:8px;">
              <span style="color:#fff;font-weight:900;font-size:18px;letter-spacing:-0.5px;">ADOWE</span>
              <span style="background:linear-gradient(135deg,#00c2ff,#8b5cf6);color:white;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:2px;">LAB</span>
            </span>
            <p style="margin:6px 0 0;color:#94a3b8;font-size:11px;">📧 Démonstration — Email automatisé · ${entreprise}</p>
          </div>

          <!-- Corps email -->
          <div style="padding:36px 32px;background:#ffffff;">
            <h2 style="margin:0 0 20px;font-size:20px;color:#0f172a;font-weight:700;line-height:1.3;">${emails[0].subject}</h2>
            <div style="font-size:15px;line-height:1.8;color:#334155;white-space:pre-wrap;">${emails[0].body}</div>
          </div>

          <!-- CTA vers adowe.fr -->
          <div style="padding:28px 32px;background:#0a0f2e;text-align:center;">
            <p style="margin:0 0 6px;color:#94a3b8;font-size:13px;">Vous voulez cette séquence email pour vos vrais clients ?</p>
            <p style="margin:0 0 20px;color:#ffffff;font-size:16px;font-weight:700;">ADOWE met tout en place pour vous en 48h.</p>
            <a href="https://adowe.fr" style="display:inline-block;background:linear-gradient(135deg,#00c2ff,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:50px;letter-spacing:0.3px;">
              Découvrir ADOWE →
            </a>
            <p style="margin:16px 0 0;color:#475569;font-size:11px;">adowe.fr · Agence marketing digitale</p>
          </div>

          <!-- Séparateur -->
          <div style="height:1px;background:#f1f5f9;"></div>

          <!-- Footer info démo -->
          <div style="padding:20px 32px;background:#f8fafc;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 8px;font-size:12px;color:#64748b;font-weight:600;">🧪 CECI EST UN EMAIL DE DÉMONSTRATION</p>
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
              Cet email a été généré automatiquement par <strong>ADOWE Lab</strong> pour illustrer ce qu'une séquence email automatisée peut faire pour <strong>${entreprise}</strong>.<br/>
              En production, vos prospects recevraient une séquence de 3 emails espacés sur 7 jours.
            </p>
          </div>

        </div>`,
      });
      sent = true;
    } catch (e) { console.error("Email error:", e); }

    return NextResponse.json({ emails, sent });
  } catch (err) {
    console.error("Sequence error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
