"use client";

import { ReactNode } from "react";

interface ChatMessageProps {
  children: ReactNode;
  className?: string;
}

export function ChatMessage({ children, className = "" }: ChatMessageProps) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-quiet border border-border space-y-4 animate-scroll-up ${className}`}>
      {children}
    </div>
  );
}

export function ChatMessageHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
        VL
      </div>
      <div className="font-semibold text-lg">{children}</div>
    </div>
  );
}

export function ChatMessageContent({ children }: { children: ReactNode }) {
  return <div className="space-y-3 text-base leading-relaxed">{children}</div>;
}
