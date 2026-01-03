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
            viewerInterest: videoAnalysis.viewerInterest,
            dropZones: videoAnalysis.dropZones,
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
            auraCheck: imageAnalysis.auraCheck,
            viralProtocol: imageAnalysis.viralProtocol,
            growthPrediction: imageAnalysis.growthPrediction,
            rawAnalysis: imageAnalysis,
          };
          break;
        }

        case "TEXT": {
          // Fetch text content
          const textResponse = await fetch(audit.fileUrl);
          const textContent = await textResponse.text();

          const textAnalysis = await analyzeText(textContent);
          analysis = {
            impactScore: textAnalysis.impactScore,
            analysisStatus: "completed",
            hookStrength: textAnalysis.hookStrength,
            viralRewrites: textAnalysis.viralRewrites,
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

      // Update status to failed
      await updateAuditAnalysis(auditId, {
        analysisStatus: "failed",
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
