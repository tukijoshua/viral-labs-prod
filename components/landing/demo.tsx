"use client";

export function LandingDemo() {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">From Upload to Insight in Seconds</h2>
          <p className="text-lg text-muted-foreground">
            Watch how Viral Labs analyzes your content and provides actionable coaching
          </p>
        </div>

        <div className="relative aspect-video bg-white rounded-lg shadow-quiet-lg overflow-hidden border border-border">
          {/* Placeholder for demo video */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-full shadow-quiet mx-auto flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-slate-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Demo Video Coming Soon</p>
            </div>
          </div>

          {/* Future: Replace with actual video */}
          {/* <video
            src="/videos/demo.mp4"
            controls
            className="w-full h-full object-cover"
          /> */}
        </div>

        <div className="grid grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="font-data text-3xl font-bold mb-2">2.3s</div>
            <p className="text-sm text-muted-foreground">Average Analysis Time</p>
          </div>
          <div className="text-center">
            <div className="font-data text-3xl font-bold mb-2">94%</div>
            <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
          </div>
          <div className="text-center">
            <div className="font-data text-3xl font-bold mb-2">10K+</div>
            <p className="text-sm text-muted-foreground">Content Audits Run</p>
          </div>
        </div>
      </div>
    </section>
  );
}
