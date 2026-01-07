"use client";

import { ChatMessage, ChatMessageHeader, ChatMessageContent } from "./chat-message";
import { Target } from "lucide-react";

interface ViralTipsMessageProps {
  tips: string[];
}

export function ViralTipsMessage({ tips }: ViralTipsMessageProps) {
  return (
    <ChatMessage>
      <ChatMessageHeader>
        <Target className="w-5 h-5" />
        Viral Tips
      </ChatMessageHeader>
      <ChatMessageContent>
        <p>Here are specific, actionable improvements to maximize your content&apos;s impact:</p>

        <div className="space-y-3 mt-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 bg-card rounded-lg border border-border hover:border-slate-300 transition-colors"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <p className="flex-1 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </ChatMessageContent>
    </ChatMessage>
  );
}
