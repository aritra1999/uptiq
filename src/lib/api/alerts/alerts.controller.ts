import { verifyAuth } from '@hono/auth-js';
import { Hono, type Context } from 'hono';
import { validateRequestBody } from '../middlewares';
import { SECRET_EDGE_API_KEY } from '$env/static/private';
import { InsertAlertSchema } from '$lib/db/schema';
import {
	createAlert,
	deleteAlert,
	getAlert,
	getAlerts,
	updateAlert,
	getAlertLogs
} from './alerts.service';
import { getWebsite } from '../websites/websites.service';

const EDGE_URL = 'https://uptiq-monitor.vercel.app';

export const alertsRouter = new Hono();

export const getAlertController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { alertId } = context.req.param();
	if (!alertId) return context.json({ error: 'Missing alert Id' }, 400);

	const alertResponse = await getAlert(String(token.id), alertId);

	return context.json(
		alertResponse.error ? { error: alertResponse.error } : alertResponse.data,
		alertResponse.status
	);
};

export const getAlertsController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.query();

	const alertsResponse = await getAlerts(String(token.id), websiteId);

	return context.json(
		alertsResponse.error ? { error: alertsResponse.error } : alertsResponse.data,
		alertsResponse.status
	);
};

export const getAlertLogsController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const alertLogsResponse = await getAlertLogs(String(token.id), websiteId);

	return context.json(
		alertLogsResponse.error ? { error: alertLogsResponse.error } : alertLogsResponse.data,
		alertLogsResponse.status
	);
};

export const postAlertController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const alert = context.get('requestBody');

	const createAlertResponse = await createAlert({
		...alert,
		userId: token.id,
		websiteId
	});

	return context.json(
		createAlertResponse.error ? { error: createAlertResponse.error } : createAlertResponse.data,
		createAlertResponse.status
	);
};

export const putAlertController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { alertId } = context.req.param();
	if (!alertId) return context.json({ error: 'Missing alert ID' }, 400);

	const updatedAlert = context.get('requestBody');

	const updateAlertResponse = await updateAlert(String(token.id), alertId, updatedAlert);

	return context.json(
		updateAlertResponse.error ? { error: updateAlertResponse.error } : updateAlertResponse.data,
		updateAlertResponse.status
	);
};

export const deleteAlertController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { alertId } = context.req.param();
	if (!alertId) return context.json({ error: 'Missing alert ID' }, 400);

	const deleteAlertResponse = await deleteAlert(String(token.id), alertId);

	return context.json(
		deleteAlertResponse.error ? { error: deleteAlertResponse.error } : deleteAlertResponse.data,
		deleteAlertResponse.status
	);
};

export const testAlertController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const website = getWebsite(String(token.id), websiteId);
	if (!website) return context.json({ error: 'Website not found' }, 404);

	const apiKey = SECRET_EDGE_API_KEY;
	const alert = await fetch(`${EDGE_URL}/api/alert`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey
		},
		body: JSON.stringify({
			websiteId,
			status: 'up',
			message: `Testing trigger, timestamp: ${new Date().toISOString()}`
		})
	}).then((res) => res.json());

	return context.json(alert);
};

const PartialInsertAlertSchema = InsertAlertSchema.pick({
	type: true,
	target: true,
	enabled: true
});

alertsRouter.use(verifyAuth());

alertsRouter.get('/test/:websiteId', testAlertController);
alertsRouter.get('/:alertId', getAlertController);
alertsRouter.get('/', getAlertsController);
alertsRouter.get('/logs/:websiteId', getAlertLogsController);
alertsRouter.post(
	'/:websiteId',
	validateRequestBody(PartialInsertAlertSchema),
	postAlertController
);
alertsRouter.put('/:alertId', validateRequestBody(PartialInsertAlertSchema), putAlertController);
alertsRouter.delete('/:alertId', deleteAlertController);
