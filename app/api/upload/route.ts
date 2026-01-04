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

    // Get form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pastedText = formData.get("text") as string | null;

    // Handle pasted text (direct text input)
    if (pastedText) {
      const audit = await createAudit({
        userId,
        fileName: `Text posted ${new Date().toLocaleDateString()}`,
        fileType: "TEXT",
        fileSize: pastedText.length,
        fileUrl: "", // No blob URL needed
        textContent: pastedText, // Store directly in database
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
    }

    // Handle file upload
    if (!file) {
      return NextResponse.json(
        { error: "No file or text provided" },
        { status: 400 }
      );
    }

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
        return NextResponse.json(
          { error: "Unsupported file type" },
          { status: 400 }
        );
    }

    // For text files, read content and store directly
    if (fileType === "TEXT") {
      const textContent = await file.text();

      const audit = await createAudit({
        userId,
        fileName: file.name,
        fileType,
        fileSize: file.size,
        fileUrl: "", // No blob URL needed
        textContent, // Store directly in database
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
    }

    // For video/image files, upload to Vercel Blob
    const fileUrl = await uploadFile(file);

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
