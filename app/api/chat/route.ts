import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getAuditById } from "@/lib/db/audits";
import { chatWithContext } from "@/lib/ai/gemini";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { auditId, message } = await req.json();

    if (!auditId || !message) {
      return NextResponse.json(
        { error: "Audit ID and message required" },
        { status: 400 }
      );
    }

    // Get audit from database
    const audit = await getAuditById(auditId);

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    // Verify ownership
    if (audit.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if analysis is complete
    if (audit.analysisStatus !== "completed") {
      return NextResponse.json(
        { error: "Analysis not complete yet" },
        { status: 400 }
      );
    }

    // Get chat response with context
    const response = await chatWithContext(audit.rawAnalysis, message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Chat failed" },
      { status: 500 }
    );
  }
}
