import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { updateUserSubscription } from "@/lib/db/users";
import { SubscriptionTier } from "@prisma/client";

/**
 * Whop Webhook Handler
 *
 * Handles subscription events from Whop to update user subscription status.
 *
 * Events handled:
 * - membership.created: When a user subscribes
 * - membership.updated: When subscription changes
 * - membership.deleted: When a user cancels
 *
 * Learn more: https://docs.whop.com/webhooks
 */

interface WhopWebhookEvent {
  action: "membership.created" | "membership.updated" | "membership.deleted";
  data: {
    id: string;
    user_id: string;
    plan_id: string;
    status: "active" | "trialing" | "past_due" | "canceled" | "expired";
    metadata?: {
      clerk_user_id?: string;
    };
  };
}

export async function POST(req: Request) {
  try {
    // Verify webhook signature
    const headersList = await headers();
    const signature = headersList.get("whop-signature");
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("WHOP_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // In production, verify the signature
    // For now, we'll accept the webhook
    // TODO: Implement signature verification
    // https://docs.whop.com/webhooks#verifying-webhooks

    const event: WhopWebhookEvent = await req.json();

    console.log("Whop webhook received:", event.action);

    // Get Clerk user ID from metadata
    const clerkUserId = event.data.metadata?.clerk_user_id;

    if (!clerkUserId) {
      console.error("No Clerk user ID in webhook metadata");
      return NextResponse.json(
        { error: "Missing Clerk user ID" },
        { status: 400 }
      );
    }

    // Determine subscription tier based on plan_id
    let tier: SubscriptionTier = "FREE";

    // Map your Whop plan IDs to tiers
    // Replace these with your actual Whop plan IDs
    const PRO_PLAN_IDS = process.env.WHOP_PRO_PLAN_IDS?.split(",") || [];
    const AGENCY_PLAN_IDS = process.env.WHOP_AGENCY_PLAN_IDS?.split(",") || [];

    if (PRO_PLAN_IDS.includes(event.data.plan_id)) {
      tier = "PRO";
    } else if (AGENCY_PLAN_IDS.includes(event.data.plan_id)) {
      tier = "AGENCY";
    }

    // Handle different webhook events
    switch (event.action) {
      case "membership.created":
      case "membership.updated":
        // Update user subscription
        if (event.data.status === "active" || event.data.status === "trialing") {
          await updateUserSubscription(clerkUserId, {
            subscriptionTier: tier,
            whopUserId: event.data.user_id,
            whopMembershipId: event.data.id,
            subscriptionStatus: event.data.status,
          });
        } else {
          // Subscription is not active, downgrade to free
          await updateUserSubscription(clerkUserId, {
            subscriptionTier: "FREE",
            subscriptionStatus: event.data.status,
          });
        }
        break;

      case "membership.deleted":
        // Downgrade to free tier
        await updateUserSubscription(clerkUserId, {
          subscriptionTier: "FREE",
          subscriptionStatus: "canceled",
        });
        break;

      default:
        console.log("Unhandled webhook event:", event.action);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Whop webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook processing failed" },
      { status: 500 }
    );
  }
}
