import { Hono, type Context } from 'hono';
import { verifyAuth } from '@hono/auth-js';
import { ensureUser, getUser } from './user.service';
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

	return context.json({ message: 'User ensured!', user });
};

export const getUserController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const user = await getUser(String(token.id));

	return context.json({ ...user }, { status: 200 });
};

userRouter.use(verifyAuth());
userRouter.get('/', getUserController);
userRouter.get('/ensure-user', ensureUserController);
