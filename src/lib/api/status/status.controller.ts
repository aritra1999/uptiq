import { Hono, type Context } from 'hono';
import { getStatus, getStatusByProject, getStatusPage } from './status.service';

export const statusRouter = new Hono();

export const getStatusController = async (context: Context) => {
	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const websiteResponse = await getStatus(websiteId);

	return context.json(
		websiteResponse.error ? { error: websiteResponse.error } : websiteResponse.data,
		websiteResponse.status
	);
};

export const getStatusByProjectController = async (context: Context) => {
	const { projectSlug } = context.req.param();
	if (!projectSlug) return context.json({ error: 'Missing project slug' }, 400);

	const websiteResponse = await getStatusByProject(projectSlug);

	return context.json(
		websiteResponse.error ? { error: websiteResponse.error } : websiteResponse.data,
		websiteResponse.status
	);
};

export const getStatusPageController = async (context: Context) => {
	const { projectId } = context.req.param();
	if (!projectId) return context.json({ error: 'Missing project ID' }, 400);

	const websiteResponse = await getStatusPage(projectId);

	return context.json(
		websiteResponse.error ? { error: websiteResponse.error } : websiteResponse.data,
		websiteResponse.status
	);
};

statusRouter.get('/page/:projectId', getStatusPageController);
statusRouter.get('/project/:projectSlug', getStatusByProjectController);
statusRouter.get('/:websiteId', getStatusController);
