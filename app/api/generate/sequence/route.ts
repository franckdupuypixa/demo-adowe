import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { entreprise, secteur, offre, cible, email } = await req.json();

    const prompt = `Tu es un expert en email marketing pour le secteur "${secteur}".

Génère une séquence de 3 emails automatisés pour l'entreprise "${entreprise}" avec l'offre suivante : ${offre}.
${cible ? `Cible client : ${cible}` : ""}

Réponds UNIQUEMENT avec un JSON valide, sans markdown :
{
  "emails": [
    {
      "subject": "Objet email 1 (accrocheur)",
      "body": "Corps de l'email 1 - Bienvenue (150-200 mots, chaleureux, présente l'entreprise et l'offre)"
    },
    {
      "subject": "Objet email 2 (relance douce J+3)",
      "body": "Corps de l'email 2 - Relance (120-150 mots, rappelle la valeur, témoignage ou preuve sociale)"
    },
    {
      "subject": "Objet email 3 (urgence douce J+7)",
      "body": "Corps de l'email 3 - Offre finale (120-150 mots, CTA fort, sentiment d'urgence subtil)"
    }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const { emails } = JSON.parse(text.trim());

    // Envoyer le premier email au participant
    let sent = false;
    try {
      await resend.emails.send({
        from: "ADOWE Lab <onboarding@resend.dev>",
        to: email,
        subject: `[Démonstration ADOWE Lab] ${emails[0].subject}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;color:#1e293b;padding:40px 32px;border-radius:8px;">
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:28px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">🧪 <strong>Ceci est un email de démonstration</strong> généré par ADOWE Lab pour ${entreprise}. En situation réelle, il serait envoyé automatiquement à vos prospects.</p>
            </div>
            <pre style="white-space:pre-wrap;font-family:Inter,sans-serif;font-size:14px;line-height:1.8;color:#334155;margin:0;">${emails[0].body}</pre>
            <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Généré par <strong>ADOWE Lab</strong> · demo.adowe.fr</p>
            </div>
          </div>
        `,
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
