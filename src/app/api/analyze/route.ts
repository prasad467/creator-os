export async function POST(req: Request) {
  try {
    const { niche, platform, keywords } = await req.json();

    // Build your prompt
    const prompt = `
You are an expert content analyst. 
Analyze content for niche: "${niche}" on platform: "${platform}" with keywords: "${keywords}". 
Provide a concise, structured analysis for a content creator. Focus on:

1. Top competitor accounts
2. Content types that get the most attention
3. Engagement strategies
4. Gaps where new content can perform well

Output in a **bullet-point format**, short sentences, easy to read.
`;

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

      

// Remove unnecessary symbols/extra newlines
const cleanedOutput = output.replace(/[*#]/g, "").trim();

// Limit to first 500 characters (optional)
// const shortOutput = cleanedOutput.length > 500 ? cleanedOutput.slice(0, 500) + "..." : cleanedOutput;

return Response.json({ result: cleanedOutput });


    // return Response.json({ result: output });
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