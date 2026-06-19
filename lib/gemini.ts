import { GoogleGenerativeAI, GenerationConfig, SchemaType, type ResponseSchema } from '@google/generative-ai';

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

const METRIC_INT = { type: SchemaType.INTEGER } as const;

const SCAN_SCHEMA: ResponseSchema = {
  type: SchemaType.OBJECT,
  required: ['overall_score', 'skin_type', 'skin_age', 'metrics', 'top_concern', 'top_win', 'advice'],
  properties: {
    overall_score: { type: SchemaType.INTEGER },
    skin_type:     { type: SchemaType.STRING, format: 'enum', enum: ['oily', 'dry', 'combination', 'normal'] },
    skin_age:      { type: SchemaType.INTEGER },
    metrics: {
      type: SchemaType.OBJECT,
      required: ['hydration', 'blemish_prone', 'redness', 'oiliness', 'dark_spots', 'radiance', 'texture', 'firmness', 'wrinkles', 'dark_circles'],
      properties: {
        hydration:     METRIC_INT,
        blemish_prone: METRIC_INT,
        redness:       METRIC_INT,
        oiliness:      METRIC_INT,
        dark_spots:    METRIC_INT,
        radiance:      METRIC_INT,
        texture:       METRIC_INT,
        firmness:      METRIC_INT,
        wrinkles:      METRIC_INT,
        dark_circles:  METRIC_INT,
      },
    },
    top_concern: { type: SchemaType.STRING, format: 'enum', enum: ['acne', 'dark_spots', 'pigmentation', 'dryness', 'anti_aging'] },
    top_win:     { type: SchemaType.STRING },
    advice:      { type: SchemaType.STRING },
  },
};

export interface PreviousScanContext {
  overall_score: number;
  metrics: ScanResult['metrics'];
  createdAt: string;
}

function buildPrompt(
  mainConcern: string,
  skinType: string,
  ageRange: string,
  previousScan: PreviousScanContext | null
): string {
  const daysSince = previousScan
    ? Math.round((Date.now() - new Date(previousScan.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const historyBlock = previousScan && daysSince !== null
    ? `
PREVIOUS SCAN (${daysSince} day${daysSince === 1 ? '' : 's'} ago):
- Overall: ${previousScan.overall_score}/100
- Hydration: ${previousScan.metrics.hydration}, Texture: ${previousScan.metrics.texture}, Radiance: ${previousScan.metrics.radiance}, Dark spots: ${previousScan.metrics.dark_spots}
Consistency rule: If the face appears in similar condition, each score should stay within ±3 points of the previous value. Only deviate further if you observe a clearly visible difference (new breakout, visible irritation, significant dryness, etc).
`
    : '';

  return `You are a dermatology-grade skin analysis AI. Score conservatively and precisely.

SCORING RUBRIC — apply to every metric and to overall_score:
- 85–100: Exceptional — visibly clear, even-toned, well-hydrated, no active concerns
- 70–84: Good — minor imperfections, generally healthy skin
- 55–69: Average — noticeable concerns (mild acne, uneven tone, some dryness)
- 40–54: Below average — multiple visible concerns needing attention
- 25–39: Poor — significant skin issues clearly visible
- 0–24: Severe — extreme, widespread skin concerns

SCORING RULES:
- Be precise: a score of 72 means something meaningfully different from 68.
- overall_score is a weighted holistic impression — NOT a simple average of metrics.
- Do not inflate scores to be encouraging. Be honest and consistent.
- Indian skin context: account for natural melanin levels when scoring dark_spots and radiance — do not penalise natural deeper skin tone.
${historyBlock}
USER CONTEXT (self-reported — treat as a rough guide, not ground truth):
- Age range: ${ageRange || 'unknown'}
- Main concern: ${mainConcern}
- Self-reported skin type: ${skinType}

top_win: 2-4 word noun phrase for the strongest metric (e.g. "Even tone", "Good hydration"). No sentences.
advice: 2 sentences max. Specific and actionable.`;
}

export async function analyzeSkin(
  base64Image: string,
  mimeType: 'image/jpeg' | 'image/png',
  mainConcern: string,
  skinType: string,
  ageRange: string,
  previousScan: PreviousScanContext | null = null
): Promise<ScanResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    // thinkingBudget: 0 — disables extended thinking (saves 5-20s, no quality loss for structured extraction).
    // SDK 0.24.1 doesn't type thinkingConfig yet; cast to pass it through to the REST API.
    generationConfig: {
      temperature: 0,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: 'application/json',
      responseSchema: SCAN_SCHEMA,
    } as GenerationConfig,
  });

  const prompt = buildPrompt(mainConcern, skinType, ageRange, previousScan);

  const attempt = async (): Promise<ScanResult> => {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Scan timed out — please try again')), 45_000)
    );
    const call = model.generateContent([
      { inlineData: { data: base64Image, mimeType } },
      prompt,
    ]);
    const result = await Promise.race([call, timeout]);
    return JSON.parse(result.response.text()) as ScanResult;
  };

  try {
    return await attempt();
  } catch (e: any) {
    const msg = e?.message ?? '';
    if (msg.includes('API key') || msg.includes('PERMISSION_DENIED')) throw e;
    await new Promise((r) => setTimeout(r, 2000));
    return attempt();
  }
}
