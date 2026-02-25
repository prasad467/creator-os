export async function POST(req: Request) {
  try {
    const { niche, platform, keywords } = await req.json();

    // Build your prompt
    const prompt = `Analyze content gaps for niche: ${niche}, platform: ${platform}, keywords: ${keywords}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY!,
        },
        body: JSON.stringify(payload),
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${text}`);
    }

    const data = await response.json();

    // Extract the AI-generated text
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response from AI.';

    return Response.json({ result: output });
  } catch (error: unknown) {
    console.error('Error in /api/analyze:', error);

    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;

    return Response.json(
      { result: `Something went wrong: ${message}` },
      { status: 500 }
    );
  }
}