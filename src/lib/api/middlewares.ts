import type { Context, Next } from 'hono';
import { z } from 'zod';

export const validateRequestBody = <T extends z.ZodType>(schema: T) => {
	return async (context: Context, next: Next) => {
		try {
			const body = await context.req.json();
			const valid = schema.safeParse(body);

			if (valid.error) {
				const errorResponse = {
					error: 'Invalid input',
					details: valid.error.errors.map((issue) => `${issue.path.join('.')} is ${issue.message}`)
				};
				return context.json(errorResponse, 400);
			}

			context.set('requestBody', valid.data);
			await next();
		} catch (error) {
			console.log(error);
			return context.json({ error: 'Invalid input json' }, 400);
		}
	};
};
