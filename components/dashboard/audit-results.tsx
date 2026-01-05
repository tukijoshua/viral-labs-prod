"use client";

import { useState } from "react";
import { Audit } from "@prisma/client";
import { ImpactScoreMessage } from "./results/impact-score-message";
import { ViralTipsMessage } from "./results/viral-tips-message";
import { AlternativesMessage } from "./results/alternatives-message";
import { PlatformInsightsMessage } from "./results/platform-insights-message";
import { ViralProtocolMessage } from "./results/viral-protocol-message";
import { GrowthPredictionMessage } from "./results/growth-prediction-message";
import { VideoAnalysisCard } from "./results/video-analysis-card";
import { ImageAnalysisCard } from "./results/image-analysis-card";
import { ChatConversation } from "./results/chat-conversation";
import { ChatInput } from "./results/chat-input";

interface AuditResultsProps {
  audit: Audit;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AuditResults({ audit }: AuditResultsProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleChatResponse = (question: string, answer: string) => {
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "assistant", content: answer },
    ]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{audit.fileName}</h1>
            <p className="text-muted-foreground">
              Analyzed {new Date(audit.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Impact Score */}
          <ImpactScoreMessage score={audit.impactScore || 0} />

          {/* Viral Tips (NEW) */}
          {audit.viralTips && Array.isArray(audit.viralTips) && audit.viralTips.length > 0 && (
            <ViralTipsMessage tips={audit.viralTips as string[]} />
          )}

          {/* Alternatives (NEW) */}
          {audit.alternatives && Array.isArray(audit.alternatives) && audit.alternatives.length > 0 && (
            <AlternativesMessage alternatives={audit.alternatives as any[]} />
          )}

          {/* Platform Insights (NEW - X/Twitter specific) */}
          {audit.platformInsights && (
            <PlatformInsightsMessage insights={audit.platformInsights as any} />
          )}

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

          {/* Text Hook Strength */}
          {audit.fileType === "TEXT" && audit.hookStrength && (
            <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-6">
              <h3 className="text-xl font-bold mb-4">Hook Strength</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-lg font-bold font-data flex items-center justify-center text-sm ${
                          i < audit.hookStrength!
                            ? "bg-slate-900 text-white"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Viral Protocol */}
          {audit.viralProtocol && Array.isArray(audit.viralProtocol) && audit.viralProtocol.length > 0 && (
            <ViralProtocolMessage protocol={audit.viralProtocol as string[]} />
          )}

          {/* Growth Prediction */}
          {audit.growthPrediction && (
            <GrowthPredictionMessage prediction={audit.growthPrediction as any} />
          )}

          {/* Chat Conversation */}
          {chatMessages.length > 0 && (
            <div className="mt-8">
              <ChatConversation messages={chatMessages} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Chat Input at Bottom */}
      <div className="sticky bottom-0 bg-white border-t border-border shadow-quiet-lg">
        <ChatInput auditId={audit.id} onResponse={handleChatResponse} />
      </div>
    </div>
  );
}
