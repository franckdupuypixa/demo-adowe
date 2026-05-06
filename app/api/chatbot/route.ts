import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const { messages, systemPrompt } = await req.json();

    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const reply = response.content[0].type === "text" ? response.content[0].text : "Je n'ai pas compris votre question.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chatbot error:", err);
    return NextResponse.json({ reply: "Une erreur est survenue. Réessayez." }, { status: 500 });
  }
}
