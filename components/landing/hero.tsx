"use client";

import { Button } from "@/components/ui/button";
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingHero() {
  const { isSignedIn } = useUser();

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-gradient leading-tight">
          See why your content works
          <br />
          (and why it doesn't)
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Enterprise-grade content diagnostics. Upload your video, image, or text
          and get an instant Impact Score with actionable steps to make it viral.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
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
                Start Free Audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
          )}
        </div>

        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>1 free audit per month</span>
          </div>
        </div>
      </div>
    </section>
  );
}
