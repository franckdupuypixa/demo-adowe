import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const { messages, systemPrompt } = await req.json();
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 80,
      messages: [
        { role: "system", content: systemPrompt + "\n\nRègle absolue : réponds en 2-3 phrases maximum, jamais plus." },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
    });
    const reply = response.choices[0].message.content || "Je n'ai pas compris.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    return NextResponse.json({ reply: "Erreur. Réessayez." }, { status: 500 });
  }
}
