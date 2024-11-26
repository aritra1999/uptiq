import { verifyAuth } from '@hono/auth-js';
import { Hono, type Context } from 'hono';
import {
	createWebsite,
	deleteWebsite,
	getWebsite,
	getWebsites,
	updateWebsite
} from './websites.service';
import { validateRequestBody } from '../middlewares';
import { InsertWebsiteSchema } from '$lib/db/schema';
import { getProjectBySlug } from '../projects/projects.service';

export const websitesRouter = new Hono();

export const getWebsiteController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { slug } = context.req.param();
	if (!slug) return context.json({ error: 'Missing project slug' }, 400);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const project = await getProjectBySlug(String(token.id), slug);
	if (!project) return context.json({ error: 'Project not found' }, 404);

	const websiteResponse = await getWebsite(String(token.id), websiteId);

	return context.json(
		websiteResponse.error ? { error: websiteResponse.error } : websiteResponse.data,
		websiteResponse.status
	);
};

export const getWebsitesController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { slug } = context.req.param();
	if (!slug) return context.json({ error: 'Missing project slug' }, 400);

	const websiteResponse = await getWebsites(String(token.id), slug);

	return context.json(
		websiteResponse.error ? { error: websiteResponse.error } : websiteResponse.data,
		websiteResponse.status
	);
};

export const postWebsitesController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { slug } = context.req.param();
	if (!slug) return context.json({ error: 'Missing project slug' }, 400);

	const project = await getProjectBySlug(String(token.id), slug);
	if (!project) return context.json({ error: 'Project not found' }, 404);

	const website = context.get('requestBody');

	const createWebsiteResponse = await createWebsite({
		userId: String(token.id),
		projectId: project.id,
		name: website.name as string,
		url: website.url as string,
		checkInterval: website.checkInterval
	});

	return context.json(
		createWebsiteResponse.error
			? { error: createWebsiteResponse.error }
			: createWebsiteResponse.data,
		createWebsiteResponse.status
	);
};

export const putWebsitesController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const requestBody = context.get('requestBody');

	const updateWebsiteResponse = await updateWebsite(String(token.id), websiteId, requestBody);

	return context.json(
		updateWebsiteResponse.error
			? { error: updateWebsiteResponse.error }
			: updateWebsiteResponse.data,
		updateWebsiteResponse.status
	);
};

export const deleteWebsitesController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const deleteWebsiteResponse = await deleteWebsite(String(token.id), websiteId);

	return context.json(
		deleteWebsiteResponse.error
			? { error: deleteWebsiteResponse.error }
			: deleteWebsiteResponse.data,

		deleteWebsiteResponse.status
	);
};

const PartialInsertWebsiteSchema = InsertWebsiteSchema.pick({
	name: true,
	url: true,
	checkInterval: true
});

websitesRouter.use(verifyAuth());
websitesRouter.get('/:slug/:websiteId', getWebsiteController);
websitesRouter.get('/:slug', getWebsitesController);
websitesRouter.post(
	'/:slug',
	validateRequestBody(PartialInsertWebsiteSchema),
	postWebsitesController
);
websitesRouter.put(
	'/:websiteId',
	validateRequestBody(PartialInsertWebsiteSchema),
	putWebsitesController
);
websitesRouter.delete('/:websiteId', deleteWebsitesController);
