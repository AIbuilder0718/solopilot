import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { topic, audience, length } = body;

    if (!topic?.trim()) {
      return NextResponse.json(
        { error: "Video topic is required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are an expert YouTube scriptwriter.

Create a complete YouTube script using these settings:

Topic: ${topic}
Target audience: ${audience}
Video length: ${length}

Write in Korean unless the user explicitly requests another language.

Use this structure:

1. Title
2. Hook
3. Introduction
4. Main content
5. Call to action

Requirements:
- Start with a strong hook.
- Make the script practical and engaging.
- Use natural spoken language.
- Avoid generic or repetitive wording.
- Match the requested video length.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return NextResponse.json({
      script: response.text ?? "",
    });
  } catch (error) {
    console.error("Script generation error:", error);

    const details =
      error instanceof Error ? error.message : "Unknown error occurred.";

    return NextResponse.json(
      {
        error: "Failed to generate script.",
        details,
      },
      { status: 500 }
    );
  }
}