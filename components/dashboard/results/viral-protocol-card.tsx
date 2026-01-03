import { CheckCircle2 } from "lucide-react";

interface ViralProtocolCardProps {
  protocol: string[];
}

export function ViralProtocolCard({ protocol }: ViralProtocolCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Viral Protocol</h2>
        <p className="text-muted-foreground">
          Follow these 3 steps to maximize your content's impact
        </p>
      </div>

      <div className="space-y-4">
        {protocol.map((step, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 bg-card rounded-lg shadow-quiet"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold font-data">
                {index + 1}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-base leading-relaxed">{step}</p>
            </div>
            <div className="flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
