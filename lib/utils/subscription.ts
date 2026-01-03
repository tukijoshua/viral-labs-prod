import { SubscriptionTier } from "@prisma/client";

export function canAccessFeature(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  const tierHierarchy = {
    FREE: 0,
    PRO: 1,
    AGENCY: 2,
  };

  return tierHierarchy[userTier] >= tierHierarchy[requiredTier];
}

export function getUpgradeUrl(currentTier: SubscriptionTier): string {
  if (currentTier === "FREE") {
    return "https://whop.com/viral-labs-pro";
  }
  if (currentTier === "PRO") {
    return "https://whop.com/viral-labs-agency";
  }
  return "https://whop.com/viral-labs";
}

export function getFeaturesByTier(tier: SubscriptionTier): string[] {
  switch (tier) {
    case "AGENCY":
      return [
        "Unlimited audits",
        "Full Viral Protocol",
        "Growth predictions",
        "Unlimited audit history",
        "PDF export reports",
        "Priority analysis speed",
        "5 user seats",
        "Bulk audit processing",
        "Client report branding",
        "API access",
        "Dedicated support",
      ];
    case "PRO":
      return [
        "Unlimited audits",
        "Full Viral Protocol",
        "Growth predictions",
        "Unlimited audit history",
        "PDF export reports",
        "Priority analysis speed",
      ];
    case "FREE":
    default:
      return [
        "1 audit per month",
        "Basic Impact Score",
        "Basic recommendations",
        "7-day audit history",
      ];
  }
}
