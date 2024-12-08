import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { initAuthConfig, type AuthConfig } from '@hono/auth-js';
import GitHub from '@auth/sveltekit/providers/github';
import {
	SECRET_AUTH_GITHUB_ID,
	SECRET_AUTH_GITHUB_SECRET,
	SECRET_AUTH_SECRET
} from '$env/static/private';
import { userRouter } from './user/user.controller';
import { projectsRouter } from './projects/projects.controller';
import { websitesRouter } from './websites/websites.controller';
import { statusRouter } from './status/status.controller';
import { messagesRouter } from './messages/messages.controller';

export const api = new Hono().basePath('/api');

api.use(initAuthConfig(getAuthConfig));
api.use(logger());

api.route('/user', userRouter);
api.route('/projects', projectsRouter);
api.route('/websites', websitesRouter);
api.route('/status', statusRouter);
api.route('/messages', messagesRouter);

function getAuthConfig(): AuthConfig {
	return {
		secret: SECRET_AUTH_SECRET,
		providers: [
			GitHub({
				clientId: SECRET_AUTH_GITHUB_ID,
				clientSecret: SECRET_AUTH_GITHUB_SECRET
			})
		]
	};
}
