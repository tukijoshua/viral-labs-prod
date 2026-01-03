import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserAudits } from "@/lib/db/audits";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const audits = await getUserAudits(userId);

    return NextResponse.json(audits);
  } catch (error) {
    console.error("Error fetching audits:", error);
    return NextResponse.json(
      { error: "Failed to fetch audits" },
      { status: 500 }
    );
  }
}
