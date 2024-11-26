import { Hono, type Context } from 'hono';
import { verifyAuth } from '@hono/auth-js';
import { ensureUser } from './user.service';
import type { InsertUser } from '$lib/db/schema';

export const userRouter = new Hono();

export const ensureUserController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const user: InsertUser = {
		id: token.id as string,
		username: token.login as string,
		email: token.email as string,
		name: token.name
	};

	await ensureUser(user);

	return context.json({ message: 'Ensured user!', user });
};

userRouter.use(verifyAuth());
userRouter.get('/ensure-user', ensureUserController);
