import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

type ContentMode = "standard" | "faceless";

type GenerateRequestBody = {
  topic?: unknown;
  audience?: unknown;
  length?: unknown;
  contentMode?: unknown;
};

function isContentMode(value: unknown): value is ContentMode {
  return value === "standard" || value === "faceless";
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function buildStandardPrompt(
  topic: string,
  audience: string,
  length: string
): string {
  return `
You are an expert YouTube scriptwriter.

Create a complete YouTube script using these settings:

Topic: ${topic}
Target audience: ${audience}
Video length: ${length}

Write in Korean unless the user explicitly requests another language in the topic.

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
`.trim();
}

function buildFacelessPrompt(
  topic: string,
  audience: string,
  length: string
): string {
  return `
You are an expert faceless YouTube content producer and scriptwriter.

Create a complete faceless video production plan using these settings:

Topic: ${topic}
Target audience: ${audience}
Video length: ${length}
Content format: Faceless content

Write in Korean unless the user explicitly requests another language in the topic.

This video must be produced WITHOUT showing a person's face on camera.
Prefer visuals such as:
- stock footage
- screen recording
- motion graphics
- AI images
- text animation
- product close-ups
- hands-only shots

Adjust the number of scenes and narration length to fit the requested video length.
For example:
- 30 seconds: about 3-5 scenes
- 3 minutes: about 6-10 scenes
- 10 minutes: about 10-16 scenes

Use this exact structure:

1. Title
2. Core concept
3. Scene-by-scene plan

For EVERY scene, include all of the following fields:
- Timestamp (e.g. 0:00-0:15)
- Narration
- Visual direction
- On-screen text
- Suggested stock footage or image search keywords
- Sound effect or music cue

After the scene-by-scene plan, add:
4. Thumbnail text ideas (exactly 3 ideas)
5. Video description
6. Hashtags

Requirements:
- Make narration natural and easy to speak.
- Make each scene visually clear and editable in CapCut/Premiere-style workflows.
- Keep pacing matched to the requested video length.
- Avoid generic filler.
- Do not assume talking-head footage.
`.trim();
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is missing." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as GenerateRequestBody;
    const topic = asTrimmedString(body.topic);
    const audience = asTrimmedString(body.audience) || "Beginner";
    const length = asTrimmedString(body.length) || "3 minutes";
    const contentMode: ContentMode = isContentMode(body.contentMode)
      ? body.contentMode
      : "standard";

    if (!topic) {
      return NextResponse.json(
        { error: "Video topic is required." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt =
      contentMode === "faceless"
        ? buildFacelessPrompt(topic, audience, length)
        : buildStandardPrompt(topic, audience, length);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return NextResponse.json({
      script: response.text ?? "",
      contentMode,
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
