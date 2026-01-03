"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface AuditLoadingProps {
  auditId: string;
}

export function AuditLoading({ auditId }: AuditLoadingProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 5;
      });
    }, 200);

    // Poll for completion
    const pollInterval = setInterval(async () => {
      const res = await fetch(`/api/audit/${auditId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.analysisStatus === "completed") {
          setProgress(100);
          setTimeout(() => {
            router.refresh();
          }, 500);
        }
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(pollInterval);
    };
  }, [auditId, router]);

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="max-w-md w-full space-y-8 animate-scroll-up">
        <div className="flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-slate-900" />
        </div>

        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Analyzing Your Content</h2>
            <p className="text-muted-foreground">
              Our AI is processing your content to provide actionable insights...
            </p>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="text-center text-sm text-muted-foreground font-data">
            {progress}%
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-card rounded-lg shadow-quiet mx-auto mb-2 flex items-center justify-center">
              ✓
            </div>
            <div className="text-xs text-muted-foreground">Content Loaded</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-card rounded-lg shadow-quiet mx-auto mb-2 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div className="text-xs text-muted-foreground">AI Processing</div>
          </div>
          <div className="text-center opacity-40">
            <div className="w-12 h-12 bg-card rounded-lg shadow-quiet mx-auto mb-2 flex items-center justify-center">
              ○
            </div>
            <div className="text-xs text-muted-foreground">Results Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
}
