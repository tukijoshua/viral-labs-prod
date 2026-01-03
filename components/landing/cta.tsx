"use client";

import { Button } from "@/components/ui/button";
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
  const { isSignedIn } = useUser();

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-5xl font-bold text-gradient">
          Ready to make content that works?
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of creators using Viral Labs to optimize their content
          before it goes live.
        </p>

        {isSignedIn ? (
          <Link href="/dashboard">
            <Button size="lg" className="text-base">
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <SignUpButton mode="modal">
            <Button size="lg" className="text-base">
              Start Your Free Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignUpButton>
        )}

        <div className="pt-12 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2026 Viral Labs. Built for creators, by creators.
          </p>
        </div>
      </div>
    </section>
  );
}
