import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    openai: !!process.env.OPENAI_API_KEY ? "✅ présente" : "❌ MANQUANTE",
    resend: !!process.env.RESEND_API_KEY ? "✅ présente" : "❌ MANQUANTE",
    token: !!process.env.TOKEN_SECRET ? "✅ présente" : "❌ MANQUANTE",
  });
}
