import { TrendingUp } from "lucide-react";

interface GrowthPredictionCardProps {
  prediction: {
    currentEstimate: string;
    improvedEstimate: string;
    increasePercentage: number;
  };
}

export function GrowthPredictionCard({ prediction }: GrowthPredictionCardProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg shadow-quiet-lg p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Growth Prediction</h2>
          <p className="text-white/80">
            Estimated reach improvement with recommended changes
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/10 rounded-lg p-6">
          <div className="text-sm text-white/70 mb-2">Current Estimate</div>
          <div className="text-2xl font-bold font-data">
            {prediction.currentEstimate}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-6">
          <div className="text-sm text-white/70 mb-2">With Improvements</div>
          <div className="text-2xl font-bold font-data text-green-400">
            {prediction.improvedEstimate}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold font-data text-green-400 mb-1">
              +{prediction.increasePercentage}%
            </div>
            <div className="text-sm text-white/70">Increase</div>
          </div>
        </div>
      </div>
    </div>
  );
}
