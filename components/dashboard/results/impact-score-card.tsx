interface ImpactScoreCardProps {
  score: number;
}

export function ImpactScoreCard({ score }: ImpactScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Work";
  };

  return (
    <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Impact Score</h2>
          <p className="text-muted-foreground">
            Overall content effectiveness rating
          </p>
        </div>
        <div className="text-center">
          <div className={`text-7xl font-bold font-data ${getScoreColor(score)}`}>
            {score}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {getScoreLabel(score)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-3 bg-secondary rounded-full overflow-hidden">
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
    </div>
  );
}
