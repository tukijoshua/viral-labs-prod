"use client";

import { ChatMessage, ChatMessageHeader, ChatMessageContent } from "./chat-message";
import { TrendingUp, ArrowUp } from "lucide-react";

interface GrowthPrediction {
  currentEstimate: string;
  improvedEstimate: string;
  increasePercentage: number;
}

interface GrowthPredictionMessageProps {
  prediction: GrowthPrediction;
}

export function GrowthPredictionMessage({ prediction }: GrowthPredictionMessageProps) {
  return (
    <ChatMessage className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-green-500">
      <ChatMessageHeader>
        <TrendingUp className="w-5 h-5" />
        Growth Prediction
      </ChatMessageHeader>
      <ChatMessageContent>
        <p className="text-white/90">
          Based on the improvements above, here's your estimated reach increase:
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-6">
          <div className="bg-white/10 rounded-lg p-5 backdrop-blur">
            <div className="text-sm text-white/70 mb-2">Current Estimate</div>
            <div className="text-2xl font-bold font-data">{prediction.currentEstimate}</div>
          </div>

          <div className="bg-white/10 rounded-lg p-5 backdrop-blur">
            <div className="text-sm text-white/70 mb-2">With Improvements</div>
            <div className="text-2xl font-bold font-data text-green-200">
              {prediction.improvedEstimate}
            </div>
          </div>

          <div className="bg-white/20 rounded-lg p-5 backdrop-blur flex items-center justify-center border-2 border-white/30">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-4xl font-bold font-data mb-1">
                <ArrowUp className="w-8 h-8" />
                {prediction.increasePercentage}%
              </div>
              <div className="text-sm text-white/80">Increase</div>
            </div>
          </div>
        </div>

        <p className="text-sm text-white/80">
          Implement the Viral Protocol above to achieve this growth potential.
        </p>
      </ChatMessageContent>
    </ChatMessage>
  );
}
