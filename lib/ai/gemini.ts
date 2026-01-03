import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface VideoAnalysis {
  impactScore: number;
  viewerInterest: {
    timestamps: number[];
    scores: number[];
  };
  dropZones: {
    timestamp: number;
    reason: string;
  }[];
  viralProtocol: string[];
  growthPrediction: {
    currentEstimate: string;
    improvedEstimate: string;
    increasePercentage: number;
  };
}

export interface ImageAnalysis {
  impactScore: number;
  auraCheck: {
    vibe: string;
    status: string;
    score: number;
  };
  viralProtocol: string[];
  growthPrediction: {
    currentEstimate: string;
    improvedEstimate: string;
    increasePercentage: number;
  };
}

export interface TextAnalysis {
  impactScore: number;
  hookStrength: number;
  viralRewrites: string[];
  viralProtocol: string[];
  growthPrediction: {
    currentEstimate: string;
    improvedEstimate: string;
    increasePercentage: number;
  };
}

export async function analyzeVideo(videoUrl: string): Promise<VideoAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are an expert content analyst for Viral Labs. Analyze this video and provide a detailed assessment.

Return your analysis in this EXACT JSON format (no markdown, just valid JSON):
{
  "impactScore": <number 0-100>,
  "viewerInterest": {
    "timestamps": [0, 5, 10, 15, 20],
    "scores": [<interest scores 0-100 for each timestamp>]
  },
  "dropZones": [
    {
      "timestamp": <number in seconds>,
      "reason": "<why viewers might leave here>"
    }
  ],
  "viralProtocol": [
    "<specific action 1>",
    "<specific action 2>",
    "<specific action 3>"
  ],
  "growthPrediction": {
    "currentEstimate": "<estimated current reach>",
    "improvedEstimate": "<estimated reach with fixes>",
    "increasePercentage": <number>
  }
}

Be specific, actionable, and data-driven. The viralProtocol should be 3 concrete steps to improve the content.`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "video/mp4",
          data: await fetchFileAsBase64(videoUrl),
        },
      },
    ]);

    const response = result.response.text();
    const cleanedResponse = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Video analysis error:", error);
    throw new Error("Failed to analyze video");
  }
}

export async function analyzeImage(imageUrl: string): Promise<ImageAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are an expert content analyst for Viral Labs. Analyze this image/post and provide a detailed assessment.

Return your analysis in this EXACT JSON format (no markdown, just valid JSON):
{
  "impactScore": <number 0-100>,
  "auraCheck": {
    "vibe": "<overall vibe/aesthetic description>",
    "status": "<perceived status/credibility>",
    "score": <number 0-100>
  },
  "viralProtocol": [
    "<specific action 1>",
    "<specific action 2>",
    "<specific action 3>"
  ],
  "growthPrediction": {
    "currentEstimate": "<estimated current reach>",
    "improvedEstimate": "<estimated reach with fixes>",
    "increasePercentage": <number>
  }
}

Be specific, actionable, and focused on visual appeal and social media effectiveness.`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: await fetchFileAsBase64(imageUrl),
        },
      },
    ]);

    const response = result.response.text();
    const cleanedResponse = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error("Failed to analyze image");
  }
}

export async function analyzeText(text: string): Promise<TextAnalysis> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are an expert content analyst for Viral Labs. Analyze this text content and provide a detailed assessment.

Content to analyze:
"""
${text}
"""

Return your analysis in this EXACT JSON format (no markdown, just valid JSON):
{
  "impactScore": <number 0-100>,
  "hookStrength": <number 1-10>,
  "viralRewrites": [
    "<rewrite option 1>",
    "<rewrite option 2>",
    "<rewrite option 3>"
  ],
  "viralProtocol": [
    "<specific action 1>",
    "<specific action 2>",
    "<specific action 3>"
  ],
  "growthPrediction": {
    "currentEstimate": "<estimated current reach>",
    "improvedEstimate": "<estimated reach with fixes>",
    "increasePercentage": <number>
  }
}

Be specific, actionable, and provide viral-worthy rewrites that maintain the original message but maximize engagement.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleanedResponse = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Text analysis error:", error);
    throw new Error("Failed to analyze text");
  }
}

async function fetchFileAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
