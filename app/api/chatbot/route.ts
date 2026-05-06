import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { messages, systemPrompt } = await req.json();

    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 200,
      messages: openaiMessages,
    });

    const reply = response.choices[0].message.content || "Je n'ai pas compris.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    return NextResponse.json({ reply: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}
