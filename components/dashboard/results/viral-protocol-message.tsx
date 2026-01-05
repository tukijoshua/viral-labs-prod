"use client";

import { ChatMessage, ChatMessageHeader, ChatMessageContent } from "./chat-message";
import { CheckCircle2, Clock, Zap } from "lucide-react";

interface ViralProtocolMessageProps {
  protocol: string[];
}

export function ViralProtocolMessage({ protocol }: ViralProtocolMessageProps) {
  const icons = [Zap, Clock, CheckCircle2];
  const labels = ["Immediate (2 min)", "Medium effort (15 min)", "Optional polish (30 min)"];

  return (
    <ChatMessage>
      <ChatMessageHeader>Viral Protocol</ChatMessageHeader>
      <ChatMessageContent>
        <p>Follow these 3 steps to maximize your content's viral potential:</p>

        <div className="space-y-4 mt-4">
          {protocol.slice(0, 3).map((step, index) => {
            const Icon = icons[index] || CheckCircle2;

            return (
              <div
                key={index}
                className="flex gap-4 p-5 bg-card rounded-lg border border-border hover:border-slate-300 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4" />
                    <span>{labels[index]}</span>
                  </div>
                  <p className="text-base leading-relaxed font-medium">{step}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ChatMessageContent>
    </ChatMessage>
  );
}
