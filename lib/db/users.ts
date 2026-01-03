import { prisma } from "./prisma";
import { SubscriptionTier } from "@prisma/client";

export async function createUser(data: {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}) {
  return prisma.user.create({
    data: {
      ...data,
      usageTracking: {
        create: {
          auditsThisMonth: 0,
          lastResetDate: new Date(),
        },
      },
    },
    include: {
      usageTracking: true,
    },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      usageTracking: true,
    },
  });
}

export async function updateUserSubscription(
  userId: string,
  data: {
    subscriptionTier: SubscriptionTier;
    whopUserId?: string;
    whopMembershipId?: string;
    subscriptionStatus?: string;
  }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
}

export async function checkAuditLimit(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { usageTracking: true },
  });

  if (!user) return false;

  // Pro and Agency tiers have unlimited audits
  if (user.subscriptionTier !== "FREE") return true;

  // Check if we need to reset the monthly count
  const now = new Date();
  const lastReset = user.usageTracking?.lastResetDate;

  if (lastReset && now.getMonth() !== lastReset.getMonth()) {
    await prisma.usageTracking.update({
      where: { userId },
      data: {
        auditsThisMonth: 0,
        lastResetDate: now,
      },
    });
    return true;
  }

  // Free tier: 1 audit per month
  return (user.usageTracking?.auditsThisMonth ?? 0) < 1;
}

export async function incrementAuditCount(userId: string) {
  const user = await getUserById(userId);
  if (!user?.usageTracking) return;

  await prisma.usageTracking.update({
    where: { userId },
    data: {
      auditsThisMonth: {
        increment: 1,
      },
    },
  });
}
