"use client";

import { ChatMessage, ChatMessageHeader, ChatMessageContent } from "./chat-message";
import { Twitter, TrendingUp, Clock, MessageSquare } from "lucide-react";

interface PlatformInsights {
  platform: string;
  algorithmSignals?: {
    engagementVelocity: string;
    replyLikelihood: string;
    dwellTime: string;
    viralityScore: number;
  };
  bestTimeToPost: string[];
  structureRecommendations: string[];
  engagementTriggers: string[];
}

interface PlatformInsightsMessageProps {
  insights: PlatformInsights;
}

export function PlatformInsightsMessage({ insights }: PlatformInsightsMessageProps) {
  const isXTwitter = insights.platform === "X";

  return (
    <ChatMessage className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700">
      <ChatMessageHeader>
        <Twitter className="w-5 h-5" />
        {isXTwitter ? "X/Twitter Analysis" : `${insights.platform} Insights`}
      </ChatMessageHeader>
      <ChatMessageContent>
        {isXTwitter && insights.algorithmSignals && (
          <>
            <p className="text-white/90">
              This post has been analyzed specifically for the X algorithm:
            </p>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-white/70 mb-1">Engagement Velocity</div>
                <div className="font-medium">{insights.algorithmSignals.engagementVelocity}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-white/70 mb-1">Reply Likelihood</div>
                <div className="font-medium">{insights.algorithmSignals.replyLikelihood}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-white/70 mb-1">Dwell Time</div>
                <div className="font-medium">{insights.algorithmSignals.dwellTime}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-white/70 mb-1">Virality Score</div>
                <div className="font-bold font-data text-xl text-green-400">
                  {insights.algorithmSignals.viralityScore}/100
                </div>
              </div>
            </div>
          </>
        )}

        {insights.bestTimeToPost.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4" />
              Best Times to Post
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.bestTimeToPost.map((time, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-sm backdrop-blur">
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        {insights.structureRecommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <TrendingUp className="w-4 h-4" />
              Structure Recommendations
            </div>
            <ul className="space-y-1 text-white/80 text-sm">
              {insights.structureRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {insights.engagementTriggers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <MessageSquare className="w-4 h-4" />
              Engagement Triggers
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.engagementTriggers.map((trigger, i) => (
                <span key={i} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-sm text-green-300">
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        )}
      </ChatMessageContent>
    </ChatMessage>
  );
}
