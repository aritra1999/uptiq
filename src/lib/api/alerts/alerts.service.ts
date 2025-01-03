import { db } from '$lib/db/drizzle';
import {
	alerts,
	alertLogs,
	type InsertAlert,
	type SelectAlertPartial,
	type SelectAlertLogsPartial
} from '$lib/db/schema';
import { and, desc, eq, gte } from 'drizzle-orm';
import type { ServiceResponse } from '../types';
import type { StatusCode } from 'hono/utils/http-status';
import { prettifyErrors } from '$lib/db/utils';

export const selectAlertPartialObject = {
	id: alerts.id,
	websiteId: alerts.websiteId,
	type: alerts.type,
	target: alerts.target,
	enabled: alerts.enabled
};

export const selectAlertLogsPartialObject = {
	id: alertLogs.id,
	websiteId: alertLogs.websiteId,
	status: alertLogs.status,
	sent: alertLogs.sent,
	error: alertLogs.error,
	createdAt: alertLogs.createdAt,
	message: alertLogs.message
};

export const getAlert = async (
	userId: string,
	alertId: string
): Promise<ServiceResponse<SelectAlertPartial>> => {
	return await db
		.select(selectAlertPartialObject)
		.from(alerts)
		.where(and(eq(alerts.id, alertId), eq(alerts.userId, userId)))
		.limit(1)
		.then((response) => {
			if (response.length === 0)
				return {
					status: 404 as StatusCode,
					error: 'Alert not found'
				};

			return {
				status: 200 as StatusCode,
				data: response[0]
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: error.message
			};
		});
};

export const getAlerts = async (
	userId: string,
	websiteId?: string
): Promise<ServiceResponse<SelectAlertPartial[]>> => {
	const userIdCondition = eq(alerts.userId, userId);
	const condition = websiteId
		? and(eq(alerts.websiteId, websiteId), userIdCondition)
		: userIdCondition;

	return await db
		.select(selectAlertPartialObject)
		.from(alerts)
		.where(condition)
		.then((response) => {
			return {
				status: 200 as StatusCode,
				data: response
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: error.message
			};
		});
};

export const createAlert = async (
	alert: InsertAlert
): Promise<ServiceResponse<typeof alerts.$inferSelect>> => {
	return await db
		.insert(alerts)
		.values(alert)
		.returning()
		.then((response) => {
			return {
				status: 200 as StatusCode,
				data: response[0]
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: prettifyErrors(error)
			};
		});
};

export const updateAlert = async (
	userId: string,
	alertId: string,
	updatedAlert: Partial<InsertAlert>
): Promise<ServiceResponse<typeof alerts.$inferSelect>> => {
	return await db
		.update(alerts)
		.set(updatedAlert)
		.where(and(eq(alerts.id, alertId), eq(alerts.userId, userId)))
		.returning()
		.then((response) => {
			return {
				status: 200 as StatusCode,
				data: response[0]
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: error.message
			};
		});
};

export const deleteAlert = async (
	userId: string,
	alertId: string
): Promise<ServiceResponse<{ deletedId: string }>> => {
	return await db
		.delete(alerts)
		.where(and(eq(alerts.id, alertId), eq(alerts.userId, userId)))
		.returning({ deletedId: alerts.id })
		.then((response) => {
			if (response.length === 0) {
				return {
					status: 404 as StatusCode,
					error: 'Alert not found'
				};
			}
			return {
				status: 200 as StatusCode,
				data: response[0]
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: error.message
			};
		});
};

export const getAlertLogs = async (
	userId: string,
	websiteId: string
): Promise<ServiceResponse<SelectAlertLogsPartial[]>> => {
	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	return await db
		.select(selectAlertLogsPartialObject)
		.from(alertLogs)
		.where(
			and(
				eq(alertLogs.websiteId, websiteId),
				eq(alertLogs.userId, userId),
				gte(alertLogs.createdAt, oneWeekAgo)
			)
		)
		.orderBy(desc(alertLogs.createdAt))
		.then((response) => {
			return {
				status: 200 as StatusCode,
				data: response
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: error.message
			};
		});
};
