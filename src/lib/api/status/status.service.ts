import { db } from '$lib/db/drizzle';
import {
	messages,
	projects,
	uptimeChecks,
	websites,
	type SelectPartialStatus,
	type SelectProjectPartial
} from '$lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { ServiceResponse, StatusPageMessages, StatusPageResponse } from '../types';
import type { StatusCode } from 'hono/utils/http-status';

export const getStatus = async (
	websiteId: string,
	limit = 50
): Promise<ServiceResponse<SelectPartialStatus[]>> => {
	return await db
		.select({
			status: uptimeChecks.status,
			responseTime: uptimeChecks.responseTime,
			statusCode: uptimeChecks.statusCode,
			createdAt: uptimeChecks.createdAt
		})
		.from(uptimeChecks)
		.where(eq(uptimeChecks.websiteId, websiteId))
		.limit(limit)
		.orderBy(desc(uptimeChecks.createdAt))
		.then((response) => {
			return {
				status: 200 as StatusCode,
				data: response
			};
		})
		.catch((error) => {
			console.error(error);
			return {
				status: 500 as StatusCode,
				data: []
			};
		});
};

export const getMessages = async (websiteId: string): Promise<StatusPageMessages[]> => {
	return await db
		.select({
			title: messages.title,
			content: messages.content,
			startTime: messages.startTime
		})
		.from(messages)
		.where(eq(messages.websiteId, websiteId))
		.orderBy(desc(messages.startTime))
		.catch((error) => {
			console.log(error);
			return [];
		});
};

export const getStatusByProject = async (
	projectSlug: string
): Promise<ServiceResponse<SelectProjectPartial>> => {
	return await db
		.select({
			id: projects.id,
			name: projects.name,
			description: projects.description,
			slug: projects.slug
		})
		.from(projects)
		.where(eq(projects.slug, projectSlug))
		.limit(1)
		.then((response) => {
			if (response.length === 0) {
				return {
					status: 404 as StatusCode,
					error: 'Project not found!'
				};
			}

			return {
				status: 200 as StatusCode,
				data: response[0]
			};
		})
		.catch((error) => {
			console.error(error);
			return {
				status: 500 as StatusCode,
				error: 'Error fetching project!'
			};
		});
};

export const getStatusPage = async (
	projectId: string
): Promise<ServiceResponse<StatusPageResponse[]>> => {
	const websitesResponse = await db
		.select({
			id: websites.id,
			name: websites.name,
			url: websites.url
		})
		.from(websites)
		.where(eq(websites.projectId, projectId));

	const statusPromises = websitesResponse.map(async (website) => {
		const statusResponse = await getStatus(website.id, 50);
		if (statusResponse.status !== 200 || !statusResponse.data) {
			return null;
		}

		const messages = await getMessages(website.id);

		return {
			...website,
			statuses: statusResponse.data,
			messages: messages
		};
	});

	const statuses = await Promise.all(statusPromises);
	const response = statuses.filter((website): website is StatusPageResponse => website !== null);
	return { status: 200, data: response };
};
