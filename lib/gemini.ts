import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);

export interface ScanResult {
  overall_score: number;
  skin_type: 'oily' | 'dry' | 'combination' | 'normal';
  skin_age: number;
  metrics: {
    hydration: number;
    blemish_prone: number;
    redness: number;
    oiliness: number;
    dark_spots: number;
    radiance: number;
    texture: number;
    firmness: number;
    wrinkles: number;
    dark_circles: number;
  };
  top_concern: string;
  top_win: string;
  advice: string;
}

export async function analyzeSkin(
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png',
  mainConcern: string,
  skinType: string
): Promise<ScanResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a skin analysis AI. Analyze this face photo carefully.

User context:
- Main concern: ${mainConcern}
- Self-reported skin type: ${skinType}

Return ONLY valid JSON with no markdown, no explanation:
{
  "overall_score": <0-100>,
  "skin_type": "<oily|dry|combination|normal>",
  "skin_age": <number>,
  "metrics": {
    "hydration": <0-100>,
    "blemish_prone": <0-100>,
    "redness": <0-100>,
    "oiliness": <0-100>,
    "dark_spots": <0-100>,
    "radiance": <0-100>,
    "texture": <0-100>,
    "firmness": <0-100>,
    "wrinkles": <0-100>,
    "dark_circles": <0-100>
  },
  "top_concern": "<acne|dark_spots|pigmentation|dryness|anti_aging>",
  "top_win": "<string>",
  "advice": "<2 sentences max>"
}`;

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Scan timed out — please try again')), 30_000)
  );

  const call = model.generateContent([
    { inlineData: { data: base64Image, mimeType } },
    prompt,
  ]);

  const result = await Promise.race([call, timeout]);

  const text = result.response.text().trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid Gemini response');
  return JSON.parse(jsonMatch[0]) as ScanResult;
}
