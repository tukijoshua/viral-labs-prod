import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ==================== TYPES ====================

export interface Alternative {
  version: string; // The rewritten content
  type: string; // "Hook", "Angle", "Format", "Tone"
  explanation: string; // WHY this works better
  riskLevel: "Safe" | "Moderate" | "Aggressive";
}

export interface PlatformInsights {
  platform: "X" | "Instagram" | "TikTok" | "LinkedIn" | "General";
  algorithmSignals?: {
    engagementVelocity: string;
    replyLikelihood: string;
    dwellTime: string;
    viralityScore: number;
  };
  bestTimeToPost: string[];
  structureRecommendations: string[];
  engagementTriggers: string[];
}

export interface BaseAnalysis {
  impactScore: number; // 0-100
  viralTips: string[]; // 3-5 specific, actionable tips
  alternatives: Alternative[]; // 3-5 versions with explanations
  viralProtocol: string[]; // Exactly 3 steps
  platformInsights: PlatformInsights;
  growthPrediction: {
    currentEstimate: string;
    improvedEstimate: string;
    increasePercentage: number;
  };
}

export interface VideoAnalysis extends BaseAnalysis {
  viewerInterest: {
    timestamps: number[];
    scores: number[];
  };
  dropZones: {
    timestamp: number;
    reason: string;
  }[];
}

export interface ImageAnalysis extends BaseAnalysis {
  auraCheck: {
    vibe: string;
    status: string;
    score: number;
  };
}

export interface TextAnalysis extends BaseAnalysis {
  hookStrength: number; // 1-10
}

// ==================== TIMEOUT UTILITIES ====================

async function analyzeWithTimeout<T>(
  analysisPromise: Promise<T>,
  timeoutMs: number = 60000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Analysis timeout after 60 seconds")), timeoutMs)
  );

  return Promise.race([analysisPromise, timeoutPromise]);
}

async function fetchWithTimeout(url: string, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("File fetch timeout");
    }
    throw error;
  }
}

async function fetchFileAsBase64(url: string): Promise<string> {
  const response = await fetchWithTimeout(url, 30000);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

// ==================== JSON PARSING ====================

function cleanAndParseJSON<T>(text: string): T {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  // Try parsing
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    // Fallback: extract JSON from text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error("Failed to parse JSON response from AI");
  }
}

// ==================== PLATFORM DETECTION ====================

function detectPlatform(content: string): PlatformInsights["platform"] {
  const lower = content.toLowerCase();

  // Check for X/Twitter indicators
  if (
    content.length <= 280 ||
    lower.includes("@") && content.split(" ").some(w => w.startsWith("@")) ||
    lower.includes("#") && content.split(" ").some(w => w.startsWith("#"))
  ) {
    return "X";
  }

  // Check for LinkedIn indicators
  if (lower.includes("linkedin") || content.length > 1000) {
    return "LinkedIn";
  }

  // Check for Instagram/TikTok indicators (usually with images/videos)
  return "General";
}

// ==================== ANALYSIS FUNCTIONS ====================

export async function analyzeVideo(videoUrl: string): Promise<VideoAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are an expert content strategist for Viral Labs. Analyze this video and provide a COMPLETE analysis.

YOUR MISSION: Make the user feel confident this content can go viral with your improvements.

ANALYSIS REQUIREMENTS:

1. IMPACT SCORE (0-100)
   - Rate overall viral potential
   - Consider: hook strength, emotional pull, clarity, pacing, visual quality

2. VIRAL TIPS (3-5 specific improvements)
   - Be actionable, not vague
   - Example: "Move the reveal to the first 3 seconds" NOT "Improve pacing"
   - Focus on what will drive shares, comments, and saves

3. ALTERNATIVE VERSIONS (3-5 rewrites/approaches)
   For each alternative provide:
   - version: The rewritten hook or approach
   - type: "Hook" | "Angle" | "Format" | "Tone"
   - explanation: Clear explanation of WHY it's stronger
   - riskLevel: "Safe" | "Moderate" | "Aggressive"

4. VIRAL PROTOCOL (Exactly 3 steps)
   - Step 1: Immediate fix (takes 2 min)
   - Step 2: Medium effort (takes 15 min)
   - Step 3: Optional polish (takes 30 min)

5. PLATFORM INSIGHTS
   - platform: "General" (assume multi-platform video)
   - bestTimeToPost: Specific hours + timezone
   - structureRecommendations: Hook, body, CTA structure
   - engagementTriggers: What makes people stop scrolling and engage

6. GROWTH PREDICTION
   - currentEstimate: Estimated views/reach with current version
   - improvedEstimate: Estimated views/reach with fixes applied
   - increasePercentage: % increase

7. VIEWER INTEREST (Timestamps + Engagement Scores)
   - timestamps: [0, 5, 10, 15, 20, ...] (every 5 seconds)
   - scores: [85, 90, 70, 60, ...] (engagement 0-100 for each timestamp)

8. DROP ZONES (Where viewers likely leave)
   - timestamp: Number in seconds
   - reason: Specific reason why users drop off here

TONE: Confident, technical, teachable. Users should LEARN why things work.

FORMAT: Return ONLY valid JSON. No markdown, no code blocks, no explanations outside JSON.

Example JSON structure:
{
  "impactScore": 87,
  "viralTips": ["...", "...", "..."],
  "alternatives": [
    {
      "version": "...",
      "type": "Hook",
      "explanation": "...",
      "riskLevel": "Safe"
    }
  ],
  "viralProtocol": ["Step 1...", "Step 2...", "Step 3..."],
  "platformInsights": {
    "platform": "General",
    "bestTimeToPost": ["..."],
    "structureRecommendations": ["..."],
    "engagementTriggers": ["..."]
  },
  "growthPrediction": {
    "currentEstimate": "...",
    "improvedEstimate": "...",
    "increasePercentage": 0
  },
  "viewerInterest": {
    "timestamps": [0, 5, 10],
    "scores": [85, 90, 70]
  },
  "dropZones": [
    {
      "timestamp": 12,
      "reason": "..."
    }
  ]
}`;

  const analysisPromise = (async () => {
    const videoData = await fetchFileAsBase64(videoUrl);
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "video/mp4",
          data: videoData,
        },
      },
    ]);

    const response = result.response.text();
    return cleanAndParseJSON<VideoAnalysis>(response);
  })();

  return analyzeWithTimeout(analysisPromise, 60000);
}

export async function analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are an expert content strategist for Viral Labs. Analyze this image/visual content and provide a COMPLETE analysis.

YOUR MISSION: Make the user feel confident this content can go viral with your improvements.

ANALYSIS REQUIREMENTS:

1. IMPACT SCORE (0-100)
   - Rate overall viral potential
   - Consider: visual appeal, clarity, emotional impact, originality

2. VIRAL TIPS (3-5 specific improvements)
   - Be actionable: "Add text overlay in top-left corner" NOT "Improve composition"
   - Focus on what drives shares and saves

3. ALTERNATIVE VERSIONS (3-5 approaches)
   For each alternative provide:
   - version: Description of the alternative approach
   - type: "Hook" | "Angle" | "Format" | "Tone"
   - explanation: WHY it's stronger
   - riskLevel: "Safe" | "Moderate" | "Aggressive"

4. VIRAL PROTOCOL (Exactly 3 steps)
   - Step 1: Immediate fix (2 min)
   - Step 2: Medium effort (15 min)
   - Step 3: Optional polish (30 min)

5. PLATFORM INSIGHTS
   - Detect platform from image style
   - bestTimeToPost: Specific hours
   - structureRecommendations: Caption, hashtags, etc.
   - engagementTriggers: What makes people stop and interact

6. GROWTH PREDICTION
   - currentEstimate, improvedEstimate, increasePercentage

7. AURA CHECK (Visual appeal and status perception)
   - vibe: Overall aesthetic description
   - status: Perceived credibility/authority
   - score: 0-100 overall aura rating

FORMAT: Return ONLY valid JSON. No markdown.

Example JSON structure:
{
  "impactScore": 92,
  "viralTips": ["...", "..."],
  "alternatives": [{...}],
  "viralProtocol": ["...", "...", "..."],
  "platformInsights": {...},
  "growthPrediction": {...},
  "auraCheck": {
    "vibe": "...",
    "status": "...",
    "score": 88
  }
}`;

  const analysisPromise = (async () => {
    const imageData = await fetchFileAsBase64(imageUrl);
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData,
        },
      },
    ]);

    const response = result.response.text();
    return cleanAndParseJSON<ImageAnalysis>(response);
  })();

  return analyzeWithTimeout(analysisPromise, 60000);
}

export async function analyzeText(text: string): Promise<TextAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const platform = detectPlatform(text);
  const isXTwitter = platform === "X";

  const prompt = `You are an expert content strategist for Viral Labs. Analyze this text content and provide a COMPLETE analysis.

YOUR MISSION: Make the user feel confident this content can go viral with your improvements.

${isXTwitter ? `⚠️ CRITICAL: This appears to be an X/Twitter post (${text.length} chars). Provide X-SPECIFIC analysis:
- Analyze based on X algorithm signals (engagement velocity > likes, reply likelihood, dwell time)
- Consider X's 280-char limit and threading
- Focus on conversation-worthiness
- Recommend best times to post on X
- Suggest X-specific engagement triggers (questions, hot takes, threads, data)
` : ""}

ANALYSIS REQUIREMENTS:

1. IMPACT SCORE (0-100)
   - Rate viral potential
   - Consider: hook strength, emotional pull, clarity, timing relevance

2. VIRAL TIPS (3-5 specific improvements)
   - Actionable: "Start with the number" NOT "Improve opening"
   ${isXTwitter ? "- X-specific: Threading, character usage, reply baiting" : ""}

3. ALTERNATIVE VERSIONS (3-5 rewrites)
   For each provide:
   - version: The complete rewritten version
   - type: "Hook" | "Angle" | "Format" | "Tone"
   - explanation: WHY it's stronger
   - riskLevel: "Safe" | "Moderate" | "Aggressive"

4. VIRAL PROTOCOL (Exactly 3 steps)
   - Step 1: Immediate fix (2 min)
   - Step 2: Medium effort (15 min)
   - Step 3: Optional polish (30 min)

5. PLATFORM INSIGHTS ${isXTwitter ? "(CRITICAL FOR X)" : ""}
   - platform: "${platform}"
   ${isXTwitter ? `- algorithmSignals:
     * engagementVelocity: How fast will replies come?
     * replyLikelihood: Will people want to respond?
     * dwellTime: Will they stop scrolling?
     * viralityScore: 0-100 based on X algorithm
   ` : ""}
   - bestTimeToPost: Specific hours + timezone
   - structureRecommendations: ${isXTwitter ? "Single tweet? Thread? Visual?" : "Structure tips"}
   - engagementTriggers: ${isXTwitter ? "Questions, hot takes, data, stories" : "What drives engagement"}

6. GROWTH PREDICTION
   - currentEstimate: Estimated reach
   - improvedEstimate: With fixes
   - increasePercentage: % increase

7. HOOK STRENGTH (1-10)
   - Rate first sentence/hook on 1-10 scale

FORMAT: Return ONLY valid JSON. No markdown.

Content to analyze:
"""
${text}
"""

Example JSON:
{
  "impactScore": 94,
  "viralTips": ["...", "..."],
  "alternatives": [{
    "version": "Complete rewritten post",
    "type": "Hook",
    "explanation": "...",
    "riskLevel": "Safe"
  }],
  "viralProtocol": ["...", "...", "..."],
  "platformInsights": {
    "platform": "${platform}",
    ${isXTwitter ? `"algorithmSignals": {
      "engagementVelocity": "...",
      "replyLikelihood": "...",
      "dwellTime": "...",
      "viralityScore": 85
    },` : ""}
    "bestTimeToPost": ["..."],
    "structureRecommendations": ["..."],
    "engagementTriggers": ["..."]
  },
  "growthPrediction": {...},
  "hookStrength": 8
}`;

  const analysisPromise = (async () => {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return cleanAndParseJSON<TextAnalysis>(response);
  })();

  return analyzeWithTimeout(analysisPromise, 60000);
}

// ==================== CHAT FUNCTION ====================

export async function chatWithContext(
  auditContext: any,
  message: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const contextPrompt = `You are the Viral Labs content coach. You previously analyzed this content:

ORIGINAL ANALYSIS:
${JSON.stringify(auditContext, null, 2)}

The user is now asking a follow-up question. Answer it based on your analysis, being:
- Specific and actionable
- Educational (explain WHY)
- Supportive and confident

User question: ${message}

Provide a helpful, conversational response. NO JSON, just natural text.`;

  const chatPromise = (async () => {
    const result = await model.generateContent(contextPrompt);
    return result.response.text();
  })();

  return analyzeWithTimeout(chatPromise, 30000);
}
