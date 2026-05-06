import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { userData, results } = await req.json();
    const { prenom, nom, email, entreprise, secteur, siteUrl } = userData;

    const hasMarketing = !!results.marketing;
    const hasAudit = !!results.audit;
    const hasEmail = !!results.email;
    const hasChatbot = !!results.chatbot;

    const modulesCompleted = [
      hasMarketing && "Pack Marketing",
      hasChatbot && "Chatbot IA",
      hasEmail && "Séquence Email",
      hasAudit && "Audit Digital",
    ].filter(Boolean).join(", ") || "Aucun module complété";

    // Email récap au client
    await resend.emails.send({
      from: "ADOWE Lab <lab@adowe.fr>",
      to: email,
      subject: `Votre récap ADOWE Lab — ${entreprise}`,
      html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;background:#ffffff;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#060612,#0f1a3d);padding:28px 32px;text-align:center;">
          <div style="margin-bottom:8px;">
            <span style="color:#fff;font-weight:900;font-size:22px;">ADOWE</span>
            <span style="background:linear-gradient(135deg,#00c2ff,#8b5cf6);color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;margin-left:8px;">LAB</span>
          </div>
          <p style="color:#94a3b8;font-size:13px;margin:0;">Votre session IA de 15 minutes — Récapitulatif</p>
        </div>

        <!-- Intro -->
        <div style="padding:28px 32px 0;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Bravo ${prenom} ! 🎉</h2>
          <p style="color:#64748b;font-size:14px;line-height:1.7;margin:0 0 20px;">
            Vous venez de vivre une démonstration de ce que l'IA peut faire pour <strong>${entreprise}</strong>.<br/>
            Voici un résumé de votre session.
          </p>
        </div>

        <!-- Modules complétés -->
        <div style="margin:0 32px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px 20px;">
          <p style="margin:0 0 12px;font-size:12px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Modules testés</p>
          <p style="margin:0;color:#0f172a;font-size:14px;font-weight:600;">${modulesCompleted}</p>
        </div>

        ${hasMarketing ? `
        <!-- Pack Marketing -->
        <div style="padding:20px 32px 0;">
          <h3 style="margin:0 0 12px;font-size:14px;color:#00c2ff;text-transform:uppercase;letter-spacing:1px;">🏭 Votre Tagline</h3>
          <div style="background:#f8fafc;border-left:3px solid #00c2ff;padding:12px 16px;border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:16px;font-weight:700;color:#0f172a;font-style:italic;">"${results.marketing?.tagline || ""}"</p>
          </div>
        </div>` : ""}

        ${hasAudit ? `
        <!-- Score Audit -->
        <div style="padding:20px 32px 0;">
          <h3 style="margin:0 0 12px;font-size:14px;color:#8b5cf6;text-transform:uppercase;letter-spacing:1px;">📊 Votre Score Digital</h3>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;text-align:center;">
            <div style="font-size:48px;font-weight:900;color:${results.audit?.score >= 70 ? '#22c55e' : results.audit?.score >= 40 ? '#eab308' : '#ef4444'};">${results.audit?.score || 0}<span style="font-size:20px;">/100</span></div>
            <p style="margin:8px 0 0;font-size:13px;color:#64748b;">${results.audit?.synthese || ""}</p>
          </div>
        </div>` : ""}

        <!-- CTA -->
        <div style="margin:28px 32px;background:linear-gradient(135deg,#060612,#0f1a3d);border-radius:12px;padding:28px;text-align:center;">
          <p style="color:#94a3b8;font-size:13px;margin:0 0 6px;">Prêt à passer à l'étape suivante ?</p>
          <p style="color:#ffffff;font-size:18px;font-weight:700;margin:0 0 20px;">ADOWE met tout en place pour vous en 48h</p>
          <a href="https://adowe.fr" style="display:inline-block;background:linear-gradient(135deg,#00c2ff,#8b5cf6);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 36px;border-radius:50px;">
            Discuter de mon projet →
          </a>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px 24px;text-align:center;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">ADOWE · adowe.fr — Marketing digital pour les professionnels de l'habitat</p>
        </div>

      </div>`,
    });

    // Notification complète à Franck
    await resend.emails.send({
      from: "ADOWE Lab <lab@adowe.fr>",
      to: "franckpierredupuy@gmail.com",
      subject: `🧪 Session terminée — ${prenom} ${nom} (${entreprise})`,
      html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#0a0f1e;color:#e2e8f0;padding:28px;border-radius:12px;">
        <h2 style="margin:0 0 16px;color:#fff;">🧪 Fin de session ADOWE Lab</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
          <tr><td style="padding:5px 0;color:#64748b;width:100px;">Client</td><td style="color:#e2e8f0;font-weight:600;">${prenom} ${nom}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Email</td><td style="color:#00c2ff;">${email}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Entreprise</td><td style="color:#e2e8f0;">${entreprise}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Secteur</td><td style="color:#e2e8f0;">${secteur}</td></tr>
          ${siteUrl ? `<tr><td style="padding:5px 0;color:#64748b;">Site</td><td style="color:#00c2ff;">${siteUrl}</td></tr>` : ""}
          <tr><td style="padding:5px 0;color:#64748b;">Modules</td><td style="color:#e2e8f0;">${modulesCompleted}</td></tr>
        </table>
        ${hasMarketing ? `<div style="background:#111827;border-radius:8px;padding:14px;margin-bottom:12px;"><p style="margin:0 0 6px;color:#00c2ff;font-size:11px;text-transform:uppercase;">Tagline générée</p><p style="margin:0;color:#fff;font-weight:600;">"${results.marketing?.tagline}"</p></div>` : ""}
        ${hasAudit ? `<div style="background:#111827;border-radius:8px;padding:14px;margin-bottom:12px;"><p style="margin:0 0 6px;color:#8b5cf6;font-size:11px;text-transform:uppercase;">Score digital</p><p style="margin:0;color:#fff;font-size:24px;font-weight:900;">${results.audit?.score}/100</p></div>` : ""}
        <p style="color:#475569;font-size:12px;margin:0;">→ À rappeler avec ses résultats pour closer !</p>
      </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Recap error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
