import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createVerifyToken } from "@/lib/token";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { prenom, nom, email, entreprise, secteur } = body;

    if (!prenom || !nom || !email || !entreprise || !secteur) {
      return NextResponse.json({ ok: false, message: "Champs manquants" }, { status: 400 });
    }

    const code = generateCode();
    const userData = { prenom, nom, email, entreprise, secteur };
    const token = createVerifyToken(email, code, userData);

    // Email de vérification
    await resend.emails.send({
      from: "ADOWE Lab <onboarding@resend.dev>",
      to: email,
      subject: `${code} — Votre code d'accès ADOWE Lab`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#060612;color:#e2e8f0;padding:40px 32px;border-radius:16px;border:1px solid rgba(0,194,255,0.15);">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-flex;align-items:center;gap:8px;">
              <span style="font-family:Georgia,serif;font-weight:900;font-size:22px;color:#fff;letter-spacing:-0.5px;">ADOWE</span>
              <span style="background:linear-gradient(135deg,#00c2ff,#8b5cf6);color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:2px;">LAB</span>
            </div>
          </div>

          <h1 style="text-align:center;font-size:18px;color:#fff;margin:0 0 8px;">Votre code d'accès</h1>
          <p style="text-align:center;color:#94a3b8;font-size:14px;margin:0 0 32px;">Bonjour ${prenom}, saisissez ce code pour accéder à l'expérience IA.</p>

          <div style="background:linear-gradient(135deg,#00c2ff15,#8b5cf615);border:1px solid rgba(0,194,255,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
            <div style="font-size:42px;font-weight:900;letter-spacing:10px;color:#fff;font-family:monospace;">${code}</div>
            <p style="margin:12px 0 0;color:#64748b;font-size:12px;">Valable 15 minutes · À usage unique</p>
          </div>

          <p style="color:#475569;font-size:13px;text-align:center;line-height:1.6;">
            Votre session de 15 minutes démarre dès validation.<br/>
            Préparez-vous à découvrir ce que l'IA peut faire pour <strong style="color:#94a3b8;">${entreprise}</strong>.
          </p>

          <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
            <p style="color:#334155;font-size:11px;margin:0;">ADOWE Lab · demo.adowe.fr — Ne partagez pas ce code.</p>
          </div>
        </div>
      `,
    });

    // Notification à Franck
    await resend.emails.send({
      from: "ADOWE Lab <onboarding@resend.dev>",
      to: "franckpierredupuy@gmail.com",
      subject: `🧪 Nouveau participant Lab — ${prenom} ${nom} (${entreprise})`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;background:#0a0f1e;color:#e2e8f0;padding:28px;border-radius:12px;">
          <h2 style="margin:0 0 16px;font-size:16px;color:#fff;">🧪 Nouveau participant ADOWE Lab</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:6px 0;color:#64748b;width:100px;">Prénom</td><td style="color:#e2e8f0;font-weight:600;">${prenom} ${nom}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="color:#00c2ff;">${email}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Entreprise</td><td style="color:#e2e8f0;">${entreprise}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Secteur</td><td style="color:#e2e8f0;">${secteur}</td></tr>
            <tr><td style="padding:6px 0;color:#64748b;">Date</td><td style="color:#e2e8f0;">${new Date().toLocaleString("fr-FR")}</td></tr>
          </table>
        </div>
      `,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set("adowe_verify", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 20,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
