import { Video, Image, FileText, TrendingUp, Target, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video Analysis",
    description: "See exactly where viewers drop off with our Viewer Interest Pulse Chart and Drop Zones.",
  },
  {
    icon: Image,
    title: "Aura Check",
    description: "Get instant vibe and status analysis for images and social media posts.",
  },
  {
    icon: FileText,
    title: "Hook Strength",
    description: "Score your text content 1-10 and get viral rewrites that actually work.",
  },
  {
    icon: Target,
    title: "Viral Protocol",
    description: "3 specific, actionable steps to fix your content before you post it.",
  },
  {
    icon: TrendingUp,
    title: "Growth Prediction",
    description: "Data-backed estimates on reach increase if you implement our recommendations.",
  },
  {
    icon: BarChart3,
    title: "Audit Vault",
    description: "Access your complete analysis history. Your growth data stays with you.",
  },
];

export function LandingFeatures() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Win</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Move from complex data to actionable coaching. Built for creators who want results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-lg p-8 shadow-quiet hover:shadow-quiet-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-white rounded-lg shadow-quiet flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
