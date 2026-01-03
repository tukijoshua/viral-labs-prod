"use client";

import { Audit } from "@prisma/client";
import { ImpactScoreCard } from "./results/impact-score-card";
import { ViralProtocolCard } from "./results/viral-protocol-card";
import { GrowthPredictionCard } from "./results/growth-prediction-card";
import { VideoAnalysisCard } from "./results/video-analysis-card";
import { ImageAnalysisCard } from "./results/image-analysis-card";
import { TextAnalysisCard } from "./results/text-analysis-card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditResultsProps {
  audit: Audit;
}

export function AuditResults({ audit }: AuditResultsProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-scroll-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{audit.fileName}</h1>
          <p className="text-muted-foreground">
            Analyzed {new Date(audit.createdAt).toLocaleString()}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Impact Score */}
      <ImpactScoreCard score={audit.impactScore || 0} />

      {/* Content-Specific Analysis */}
      {audit.fileType === "VIDEO" && audit.viewerInterest && audit.dropZones && (
        <VideoAnalysisCard
          viewerInterest={audit.viewerInterest as any}
          dropZones={audit.dropZones as any}
        />
      )}

      {audit.fileType === "IMAGE" && audit.auraCheck && (
        <ImageAnalysisCard auraCheck={audit.auraCheck as any} />
      )}

      {audit.fileType === "TEXT" && audit.hookStrength && audit.viralRewrites && (
        <TextAnalysisCard
          hookStrength={audit.hookStrength}
          viralRewrites={audit.viralRewrites as any}
        />
      )}

      {/* Viral Protocol */}
      {audit.viralProtocol && (
        <ViralProtocolCard protocol={audit.viralProtocol as any} />
      )}

      {/* Growth Prediction */}
      {audit.growthPrediction && (
        <GrowthPredictionCard prediction={audit.growthPrediction as any} />
      )}
    </div>
  );
}
