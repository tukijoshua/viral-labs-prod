import { prisma } from "./prisma";
import { FileType } from "@prisma/client";

export async function createAudit(data: {
  userId: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  fileUrl: string;
  textContent?: string;
}) {
  return prisma.audit.create({
    data: {
      ...data,
      analysisStatus: "pending",
    },
  });
}

export async function getAuditById(id: string) {
  return prisma.audit.findUnique({
    where: { id },
  });
}

export async function getUserAudits(userId: string, limit = 50) {
  return prisma.audit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function updateAuditAnalysis(
  auditId: string,
  data: {
    impactScore?: number;
    analysisStatus: string;
    viralTips?: any;
    alternatives?: any;
    platformInsights?: any;
    viewerInterest?: any;
    dropZones?: any;
    auraCheck?: any;
    hookStrength?: number;
    viralRewrites?: any;
    viralProtocol?: any;
    growthPrediction?: any;
    rawAnalysis?: any;
  }
) {
  return prisma.audit.update({
    where: { id: auditId },
    data,
  });
}

export async function deleteAudit(auditId: string) {
  return prisma.audit.delete({
    where: { id: auditId },
  });
}
