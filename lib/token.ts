import crypto from "crypto";

const SECRET = process.env.TOKEN_SECRET || "adowe-lab-secret-change-me";

// ── Verification token (inscription → code email) ──────────────────────────
export function createVerifyToken(
  email: string,
  code: string,
  userData: Record<string, string>
): string {
  const payload = JSON.stringify({ email, code, ts: Date.now(), userData });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(encoded).digest("hex");
  return `${encoded}.${sig}`;
}

export function readVerifyToken(
  token: string,
  inputCode: string
): { ok: true; email: string; userData: Record<string, string> } | { ok: false } {
  try {
    const [encoded, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", SECRET).update(encoded).digest("hex");
    if (sig !== expected) return { ok: false };
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString());
    // code valide 15 min
    if (Date.now() - data.ts > 15 * 60 * 1000) return { ok: false };
    if (data.code !== inputCode) return { ok: false };
    return { ok: true, email: data.email, userData: data.userData };
  } catch {
    return { ok: false };
  }
}

// ── Session token (lab page) ────────────────────────────────────────────────
export function createSession(userData: Record<string, string>): string {
  const payload = JSON.stringify({ ...userData, startTime: Date.now() });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(encoded).digest("hex");
  return `${encoded}.${sig}`;
}

export function readSession(
  token: string
): { ok: true; data: Record<string, string>; startTime: number; msLeft: number } | { ok: false } {
  try {
    const [encoded, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", SECRET).update(encoded).digest("hex");
    if (sig !== expected) return { ok: false };
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString());
    const SESSION = 15 * 60 * 1000;
    const msLeft = SESSION - (Date.now() - data.startTime);
    if (msLeft <= 0) return { ok: false };
    return { ok: true, data, startTime: data.startTime, msLeft };
  } catch {
    return { ok: false };
  }
}
