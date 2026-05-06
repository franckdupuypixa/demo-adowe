import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

async function fetchSiteContent(url: string): Promise<string> {
  try {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(fullUrl, {
      signal: AbortSignal.timeout(5000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ADOWE-Lab/1.0)" },
    });
    const html = await res.text();
    // Extraire le texte utile : titre, méta, headings, texte visible
    const title = html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1] || "";
    const description = html.match(/name="description"[^>]*content="([^"]+)"/i)?.[1] || "";
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 2000);
    return `Titre: ${title}\nDescription: ${description}\nContenu: ${text}`;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { entreprise, secteur, answers, siteUrl } = await req.json();

    // Analyse du site réel si URL fournie
    let siteContext = "";
    if (siteUrl) {
      const content = await fetchSiteContent(siteUrl);
      if (content) {
        siteContext = `\n\nCONTENU RÉEL DU SITE "${siteUrl}" :\n${content}\n\nBase ton analyse sur ce contenu réel.`;
      }
    }

    const prompt = `Tu es un consultant digital expert du secteur "${secteur}".
Analyse la présence digitale de "${entreprise}"${siteUrl ? ` (site: ${siteUrl})` : ""}.

Réponses au questionnaire :
- Réseaux sociaux : ${answers.reseaux}
- Avis Google : ${answers.avis}
- Acquisition clients : ${answers.prospect}
- Budget marketing : ${answers.budget}
${siteContext}

Génère un audit précis et personnalisé. Si tu as analysé le site réel, mentionne des éléments concrets de ce site.
JSON uniquement :
{
  "score": <0-100>,
  "synthese": "2-3 phrases personnalisées mentionnant des éléments concrets du site si disponible",
  "points_forts": ["point concret 1", "point concret 2", "point concret 3"],
  "axes_amelioration": ["axe concret 1", "axe concret 2", "axe concret 3"],
  "plan_action": [
    {"priorite": "URGENT", "action": "action concrète et précise", "impact": "impact mesurable"},
    {"priorite": "IMPORTANT", "action": "action concrète", "impact": "impact"},
    {"priorite": "MOYEN TERME", "action": "action concrète", "impact": "impact"}
  ],
  "potentiel": "2 phrases sur le potentiel de croissance avec chiffres si possible",
  "site_analyse": ${siteUrl ? "true" : "false"}
}`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 800,
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
