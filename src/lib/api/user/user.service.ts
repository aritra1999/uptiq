import { db } from '$lib/db/drizzle';
import { users, type InsertUser } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const isUserPro = async (id: string): Promise<boolean> => {
	const user = await db.select({ pro: users.pro }).from(users).where(eq(users.id, id)).limit(1);
	return user.length > 0 && user[0].pro === true;
};

export const checkUserExists = async (id: string): Promise<boolean> => {
	const result = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);
	return result.length > 0;
};

export const createUser = async (user: InsertUser) => {
	const result = await db.insert(users).values(user).returning({ id: users.id });
	return result[0];
};

export const ensureUser = async (user: InsertUser): Promise<void> => {
	const exists = await checkUserExists(user.id);
	if (exists) return;

	await createUser(user);
};
