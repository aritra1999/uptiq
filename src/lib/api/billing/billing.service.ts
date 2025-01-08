import { db } from '$lib/db/drizzle';
import { users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export async function upgrageUserPlan(
	userEmail: string,
	stripeSubscriptionId: string
): Promise<void> {
	await db.update(users).set({ pro: true, stripeSubscriptionId }).where(eq(users.email, userEmail));
}

export async function downgradeUserWithSubscription(stripeSubscriptionId: string): Promise<void> {
	await db
		.update(users)
		.set({ pro: false, stripeSubscriptionId: null })
		.where(eq(users.stripeSubscriptionId, stripeSubscriptionId));
}
