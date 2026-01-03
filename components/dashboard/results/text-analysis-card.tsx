import { Lightbulb, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TextAnalysisCardProps {
  hookStrength: number;
  viralRewrites: string[];
}

export function TextAnalysisCard({ hookStrength, viralRewrites }: TextAnalysisCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-8 space-y-8">
      {/* Hook Strength */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Hook Strength</h2>
        <p className="text-muted-foreground mb-6">
          How compelling is your opening?
        </p>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg font-bold font-data flex items-center justify-center text-sm ${
                    i < hookStrength
                      ? "bg-slate-900 text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Viral Rewrites */}
      <div>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Viral Rewrites</h3>
            <p className="text-muted-foreground">
              AI-generated alternatives optimized for engagement
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {viralRewrites.map((rewrite, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-lg p-4 shadow-quiet hover:shadow-quiet-lg transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white rounded-lg shadow-quiet flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <p className="flex-1 leading-relaxed">{rewrite}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(rewrite)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
