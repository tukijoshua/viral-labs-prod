import { NextResponse } from "next/server";
import { getAuditById, updateAuditAnalysis } from "@/lib/db/audits";
import { analyzeVideo, analyzeImage, analyzeText } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { auditId } = await req.json();

    if (!auditId) {
      return NextResponse.json({ error: "Audit ID required" }, { status: 400 });
    }

    // Get audit from database
    const audit = await getAuditById(auditId);

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Update status to processing
    await updateAuditAnalysis(auditId, {
      analysisStatus: "processing",
    });

    try {
      let analysis: any;

      // Analyze based on file type
      switch (audit.fileType) {
        case "VIDEO": {
          const videoAnalysis = await analyzeVideo(audit.fileUrl);
          analysis = {
            impactScore: videoAnalysis.impactScore,
            analysisStatus: "completed",

            // New fields
            viralTips: videoAnalysis.viralTips,
            alternatives: videoAnalysis.alternatives,
            platformInsights: videoAnalysis.platformInsights,

            // Video-specific
            viewerInterest: videoAnalysis.viewerInterest,
            dropZones: videoAnalysis.dropZones,

            // Common fields
            viralProtocol: videoAnalysis.viralProtocol,
            growthPrediction: videoAnalysis.growthPrediction,
            rawAnalysis: videoAnalysis,
          };
          break;
        }

        case "IMAGE": {
          const imageAnalysis = await analyzeImage(audit.fileUrl);
          analysis = {
            impactScore: imageAnalysis.impactScore,
            analysisStatus: "completed",

            // New fields
            viralTips: imageAnalysis.viralTips,
            alternatives: imageAnalysis.alternatives,
            platformInsights: imageAnalysis.platformInsights,

            // Image-specific
            auraCheck: imageAnalysis.auraCheck,

            // Common fields
            viralProtocol: imageAnalysis.viralProtocol,
            growthPrediction: imageAnalysis.growthPrediction,
            rawAnalysis: imageAnalysis,
          };
          break;
        }

        case "TEXT": {
          // Get text content (either from textContent field or fetch from blob)
          let textContent: string;

          if (audit.textContent) {
            // Text was stored directly in database
            textContent = audit.textContent;
          } else {
            // Text is in blob storage (legacy)
            const textResponse = await fetch(audit.fileUrl);
            textContent = await textResponse.text();
          }

          const textAnalysis = await analyzeText(textContent);
          analysis = {
            impactScore: textAnalysis.impactScore,
            analysisStatus: "completed",

            // New fields
            viralTips: textAnalysis.viralTips,
            alternatives: textAnalysis.alternatives,
            platformInsights: textAnalysis.platformInsights,

            // Text-specific
            hookStrength: textAnalysis.hookStrength,

            // Common fields
            viralProtocol: textAnalysis.viralProtocol,
            growthPrediction: textAnalysis.growthPrediction,
            rawAnalysis: textAnalysis,
          };
          break;
        }

        default:
          throw new Error("Unsupported file type");
      }

      // Update audit with analysis results
      await updateAuditAnalysis(auditId, analysis);

      return NextResponse.json({ success: true });
    } catch (analysisError) {
      console.error("Analysis error:", analysisError);

      // Update status to failed with error message
      await updateAuditAnalysis(auditId, {
        analysisStatus: "failed",
        rawAnalysis: {
          error: analysisError instanceof Error ? analysisError.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      });

      throw analysisError;
    }
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
