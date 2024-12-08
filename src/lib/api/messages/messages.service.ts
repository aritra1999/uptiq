import { db } from '$lib/db/drizzle';
import { messages, websites, type InsertMessage, type SelectMessagePartial } from '$lib/db/schema';
import { and, count, eq } from 'drizzle-orm';
import type { ServiceResponse } from '../types';
import type { StatusCode } from 'hono/utils/http-status';
import { isUserPro } from '../user/user.service';
import { prettifyErrors } from '$lib/db/utils';

export const canWbsiteHaveMoreMessages = async (
	userId: string,
	projectId: string
): Promise<boolean> => {
	if (await isUserPro(userId)) return true;

	return (await getMessagesCount(projectId)) < 5;
};

export const getMessagesCount = async (websiteId: string): Promise<number> => {
	return await db
		.select({ count: count(messages.id) })
		.from(messages)
		.where(eq(messages.websiteId, websiteId))
		.then((response) => response[0].count);
};

export const getMessage = async (
	userId: string,
	messageId: string
): Promise<ServiceResponse<SelectMessagePartial>> => {
	return await db
		.select({
			id: messages.id,
			title: messages.title,
			content: messages.content,
			startTime: messages.startTime
		})
		.from(messages)
		.where(and(eq(messages.userId, userId), eq(messages.id, messageId)))
		.limit(1)
		.then((response) => {
			if (response.length === 0)
				return {
					status: 404 as StatusCode,
					error: 'Message not found'
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

export const getMessages = async (
	userId: string,
	websiteId?: string
): Promise<ServiceResponse<SelectMessagePartial[]>> => {
	const condition = websiteId
		? and(eq(messages.userId, userId), eq(messages.websiteId, websiteId))
		: eq(messages.userId, userId);
	return await db
		.select({
			id: messages.id,
			title: messages.title,
			content: messages.content,
			websiteId: messages.websiteId,
			startTime: messages.startTime
		})
		.from(messages)
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

export const createMessage = async (
	message: InsertMessage
): Promise<ServiceResponse<SelectMessagePartial>> => {
	if (!(await canWbsiteHaveMoreMessages(message.userId, message.websiteId)))
		return {
			status: 403,
			error: 'Hobby users can create 5 messages per website!'
		};

	return await db
		.insert(messages)
		.values(message)
		.returning({
			id: messages.id,
			title: messages.title,
			content: messages.content,
			startTime: messages.startTime
		})
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

export const updateMessage = async (
	userId: string,
	messageId: string,
	updatedMessage: InsertMessage
): Promise<ServiceResponse<SelectMessagePartial>> => {
	return await db
		.update(messages)
		.set(updatedMessage)
		.where(and(eq(websites.userId, userId), eq(messages.id, messageId)))
		.returning({
			id: messages.id,
			title: messages.title,
			content: messages.content,
			startTime: messages.startTime
		})
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

export const deleteMessage = async (
	userId: string,
	messageId: string
): Promise<ServiceResponse<{ deletedId: string }>> => {
	return await db
		.delete(messages)
		.where(and(eq(messages.userId, userId), eq(messages.id, messageId)))
		.returning({ deletedId: websites.id })
		.then((response) => {
			if (response.length === 0) {
				return {
					status: 404 as StatusCode,
					error: 'Message not found'
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
