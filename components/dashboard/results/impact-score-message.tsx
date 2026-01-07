"use client";

import { ChatMessage, ChatMessageHeader, ChatMessageContent } from "./chat-message";

interface ImpactScoreMessageProps {
  score: number;
  reasons?: string[];
}

export function ImpactScoreMessage({ score, reasons }: ImpactScoreMessageProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong viral potential";
    if (score >= 60) return "Good potential with improvements";
    if (score >= 40) return "Needs significant improvements";
    return "Major revisions needed";
  };

  return (
    <ChatMessage>
      <ChatMessageHeader>I&apos;ve analyzed your content</ChatMessageHeader>
      <ChatMessageContent>
        <p>Here&apos;s my assessment:</p>

        <div className="flex items-center gap-4 my-6">
          <div className={`text-6xl font-bold font-data ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Impact Score
            </div>
            <div className="text-lg font-medium">{getScoreLabel(score)}</div>
          </div>
        </div>

        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              score >= 80
                ? "bg-green-600"
                : score >= 60
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>

        {reasons && reasons.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="font-medium">This content has potential because:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
      </ChatMessageContent>
    </ChatMessage>
  );
}
