import { Sparkles } from "lucide-react";

interface ImageAnalysisCardProps {
  auraCheck: {
    vibe: string;
    status: string;
    score: number;
  };
}

export function ImageAnalysisCard({ auraCheck }: ImageAnalysisCardProps) {
  const getAuraColor = (score: number) => {
    if (score >= 80) return "from-purple-600 to-pink-600";
    if (score >= 60) return "from-blue-600 to-cyan-600";
    return "from-slate-600 to-slate-700";
  };

  return (
    <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Aura Check</h2>
          <p className="text-muted-foreground">
            Visual appeal and status perception analysis
          </p>
        </div>
      </div>

      {/* Aura Score */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-3">
          <div className={`text-6xl font-bold font-data bg-gradient-to-r ${getAuraColor(auraCheck.score)} bg-clip-text text-transparent`}>
            {auraCheck.score}
          </div>
          <div className="text-xl text-muted-foreground">/ 100</div>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getAuraColor(auraCheck.score)} transition-all duration-1000`}
            style={{ width: `${auraCheck.score}%` }}
          />
        </div>
      </div>

      {/* Vibe and Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-6 shadow-quiet">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Vibe
          </div>
          <p className="text-lg font-medium">{auraCheck.vibe}</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-quiet">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Status
          </div>
          <p className="text-lg font-medium">{auraCheck.status}</p>
        </div>
      </div>
    </div>
  );
}
