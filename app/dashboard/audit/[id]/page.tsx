import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAuditById } from "@/lib/db/audits";
import { AuditResults } from "@/components/dashboard/audit-results";
import { AuditLoading } from "@/components/dashboard/audit-loading";

export default async function AuditPage({ params }: { params: { id: string } }) {
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const audit = await getAuditById(params.id);

  if (!audit || audit.userId !== userId) {
    notFound();
  }

  // Show loading state if analysis is not complete
  if (audit.analysisStatus === "pending" || audit.analysisStatus === "processing") {
    return <AuditLoading auditId={audit.id} />;
  }

  // Show results if complete
  if (audit.analysisStatus === "completed") {
    return <AuditResults audit={audit} />;
  }

  // Show error state
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold">Analysis Failed</h2>
        <p className="text-muted-foreground">
          Something went wrong while analyzing your content. Please try again.
        </p>
      </div>
    </div>
  );
}
