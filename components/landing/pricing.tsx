import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out Viral Labs",
    features: [
      "1 basic audit per month",
      "Impact Score analysis",
      "Basic recommendations",
      "7-day audit history",
    ],
    cta: "Start Free",
    href: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For serious content creators",
    features: [
      "Unlimited audits",
      "Full Viral Protocol access",
      "Growth predictions",
      "Unlimited audit history",
      "PDF export reports",
      "Priority analysis speed",
    ],
    cta: "Upgrade to Pro",
    href: "https://whop.com/viral-labs-pro",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$199",
    period: "/mo",
    description: "For content teams and agencies",
    features: [
      "Everything in Pro",
      "5 user seats included",
      "Bulk audit processing",
      "Client report branding",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: "https://whop.com/viral-labs-agency",
    highlighted: false,
  },
];

export function LandingPricing() {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees. Cancel anytime. Powered by Whop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-lg p-8 shadow-quiet ${
                tier.highlighted
                  ? "ring-2 ring-slate-900 shadow-quiet-lg scale-105"
                  : ""
              }`}
            >
              {tier.highlighted && (
                <div className="text-xs font-semibold text-slate-900 mb-4 uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-data">{tier.price}</span>
                  {tier.period && (
                    <span className="text-muted-foreground">{tier.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={tier.highlighted ? "default" : "outline"}
                asChild
              >
                <a href={tier.href} target={tier.name === "Free" ? "_self" : "_blank"}>
                  {tier.cta}
                </a>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          All plans include secure payment processing through Whop.
          <br />
          Questions? Contact us at support@virallabs.io
        </p>
      </div>
    </section>
  );
}
