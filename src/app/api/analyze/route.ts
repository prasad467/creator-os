import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { niche, platform, keywords } = await req.json();

    const prompt = `
    Analyze the content niche "${niche}" on ${platform}.
    Keywords: ${keywords}

    Provide:
    1. Competition level (Low/Medium/High)
    2. Content gaps creators are missing
    3. Viral probability score (0-100)
    4. 3 viral content ideas
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({
      result: completion.choices[0].message.content,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}