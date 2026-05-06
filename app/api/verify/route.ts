import { NextRequest, NextResponse } from "next/server";
import { readVerifyToken, createSession } from "@/lib/token";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const cookieStore = await cookies();
    const verifyToken = cookieStore.get("adowe_verify")?.value;

    if (!verifyToken) {
      return NextResponse.json({ ok: false, message: "Session expirée. Recommencez l'inscription." });
    }

    const result = readVerifyToken(verifyToken, code);
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: "Code incorrect ou expiré." });
    }

    const sessionToken = createSession(result.userData);

    const response = NextResponse.json({ ok: true });
    // Supprimer le cookie de vérification
    response.cookies.delete("adowe_verify");
    // Créer la session
    response.cookies.set("adowe_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 20, // 20 min (un peu plus que la session de 15 min)
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
