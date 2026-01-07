"use client";

import { useState } from "react";
import { ChatMessage, ChatMessageHeader, ChatMessageContent } from "./chat-message";
import { Lightbulb, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Alternative {
  version: string;
  type: string;
  explanation: string;
  riskLevel: "Safe" | "Moderate" | "Aggressive";
}

interface AlternativesMessageProps {
  alternatives: Alternative[];
}

export function AlternativesMessage({ alternatives }: AlternativesMessageProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Safe":
        return "text-green-600 bg-green-50 border-green-200";
      case "Moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Aggressive":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <ChatMessage>
      <ChatMessageHeader>
        <Lightbulb className="w-5 h-5" />
        Alternative Versions
      </ChatMessageHeader>
      <ChatMessageContent>
        <p>I&apos;ve created {alternatives.length} alternative versions, each optimized for engagement:</p>

        <div className="space-y-4 mt-4">
          {alternatives.map((alt, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-5 bg-card hover:shadow-quiet transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">Version {index + 1}</span>
                  <span className="text-sm text-muted-foreground">• {alt.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskColor(alt.riskLevel)}`}>
                    {alt.riskLevel}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(alt.version, index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-3 border border-border font-medium">
                {alt.version}
              </div>

              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Why this works: </span>
                {alt.explanation}
              </div>
            </div>
          ))}
        </div>
      </ChatMessageContent>
    </ChatMessage>
  );
}
