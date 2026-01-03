"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useEffect, useState } from "react";

export function DashboardTopBar() {
  const { user } = useUser();
  const [subscriptionTier, setSubscriptionTier] = useState<string>("FREE");

  useEffect(() => {
    fetchUserTier();
  }, []);

  async function fetchUserTier() {
    try {
      const res = await fetch("/api/user/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscriptionTier(data.tier);
      }
    } catch (error) {
      console.error("Failed to fetch subscription tier:", error);
    }
  }

  return (
    <div className="h-16 border-b border-border bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">
          {user?.firstName ? `Welcome back, ${user.firstName}` : "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {subscriptionTier === "FREE" && (
          <Button asChild size="sm" className="gap-2">
            <a href="https://whop.com/viral-labs-pro" target="_blank" rel="noopener noreferrer">
              <Crown className="h-4 w-4" />
              Upgrade to Pro
            </a>
          </Button>
        )}

        {subscriptionTier === "PRO" && (
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg">
            <Crown className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Pro</span>
          </div>
        )}

        {subscriptionTier === "AGENCY" && (
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-lg">
            <Crown className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Agency</span>
          </div>
        )}

        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
