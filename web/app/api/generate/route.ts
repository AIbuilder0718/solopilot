import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, audience, length } = body;

    if (!topic?.trim()) {
      return NextResponse.json(
        { error: "Video topic is required." },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      store: false,
      input: `
You are an expert YouTube scriptwriter.

Create a complete YouTube script using these settings:

Topic: ${topic}
Target audience: ${audience}
Video length: ${length}

Write the script in this structure:

1. Title
2. Hook
3. Introduction
4. Main content
5. Call to action

Make it engaging, practical, and easy to speak naturally.
      `,
    });

    return NextResponse.json({
      script: response.output_text,
    });
  } catch (error) {
    console.error("Script generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate script." },
      { status: 500 }
    );
  }
}