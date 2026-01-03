import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/blob";
import { createAudit } from "@/lib/db/audits";
import { checkAuditLimit, incrementAuditCount } from "@/lib/db/users";
import { getFileType } from "@/lib/utils";
import { FileType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check audit limit
    const canAudit = await checkAuditLimit(userId);
    if (!canAudit) {
      return NextResponse.json(
        { error: "Monthly audit limit reached. Upgrade to Pro for unlimited audits." },
        { status: 403 }
      );
    }

    // Get file from form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const fileUrl = await uploadFile(file);

    // Determine file type
    const fileTypeStr = getFileType(file.name);
    let fileType: FileType;

    switch (fileTypeStr) {
      case "video":
        fileType = "VIDEO";
        break;
      case "image":
        fileType = "IMAGE";
        break;
      case "text":
        fileType = "TEXT";
        break;
      default:
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    // Create audit in database
    const audit = await createAudit({
      userId,
      fileName: file.name,
      fileType,
      fileSize: file.size,
      fileUrl,
    });

    // Increment audit count
    await incrementAuditCount(userId);

    // Trigger analysis in background
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditId: audit.id }),
    }).catch(console.error);

    return NextResponse.json({ auditId: audit.id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
