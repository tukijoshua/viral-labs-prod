"use client";

import { useUser } from "@clerk/nextjs";

export function WelcomeMessage() {
  const { user } = useUser();

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold">
        {user?.firstName ? `Hey ${user.firstName}, ` : "Hey there, "}
        what are we analyzing today?
      </h1>
      <p className="text-lg text-muted-foreground">
        Drop your content below to get instant insights and actionable coaching.
      </p>
    </div>
  );
}
