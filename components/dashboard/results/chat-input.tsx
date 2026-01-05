"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  auditId: string;
  onResponse: (question: string, answer: string) => void;
}

export function ChatInput({ auditId, onResponse }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const question = message.trim();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          message: question,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      onResponse(question, data.response);
    } catch (error) {
      console.error("Chat error:", error);
      onResponse(question, "Sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-border bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me anything about this analysis... (e.g., 'What's the strongest hook?', 'Which version is safest?')"
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-lg border border-border",
                "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent",
                "resize-none font-sans text-base min-h-[56px] max-h-[200px]",
                "placeholder:text-muted-foreground"
              )}
              disabled={loading}
              rows={1}
            />
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || loading}
            size="lg"
            className="px-6"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}
