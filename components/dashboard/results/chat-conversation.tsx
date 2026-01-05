"use client";

import { ChatMessage, ChatMessageContent } from "./chat-message";

interface ChatConversationProps {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export function ChatConversation({ messages }: ChatConversationProps) {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.role === "user" ? (
            <div className="flex justify-end">
              <div className="bg-slate-900 text-white rounded-lg p-4 max-w-2xl shadow-quiet">
                <p className="text-base leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ) : (
            <ChatMessage>
              <ChatMessageContent>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </ChatMessageContent>
            </ChatMessage>
          )}
        </div>
      ))}
    </div>
  );
}
