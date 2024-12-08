import { verifyAuth } from '@hono/auth-js';
import { Hono, type Context } from 'hono';
import {
	createMessage,
	deleteMessage,
	getMessage,
	getMessages,
	updateMessage
} from './messages.service';
import { validateRequestBody } from '../middlewares';
import { InsertMessageSchema } from '$lib/db/schema';

export const messagesRouter = new Hono();

export const getMessageController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { messageId } = context.req.param();
	if (!messageId) return context.json({ error: 'Missing message Id' }, 400);

	const messageResponse = await getMessage(String(token.id), messageId);

	return context.json(
		messageResponse.error ? { error: messageResponse.error } : messageResponse.data,
		messageResponse.status
	);
};

export const getMessagesController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.query();

	const messagesResponse = await getMessages(String(token.id), websiteId);

	return context.json(
		messagesResponse.error ? { error: messagesResponse.error } : messagesResponse.data,
		messagesResponse.status
	);
};

export const postMessageController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const message = context.get('requestBody');

	const createWebsiteResponse = await createMessage({
		userId: String(token.id),
		websiteId: websiteId,
		...message
	});

	return context.json(
		createWebsiteResponse.error
			? { error: createWebsiteResponse.error }
			: createWebsiteResponse.data,
		createWebsiteResponse.status
	);
};

export const putMessageController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { websiteId } = context.req.param();
	if (!websiteId) return context.json({ error: 'Missing website ID' }, 400);

	const { messageId } = context.req.param();
	if (!messageId) return context.json({ error: 'Missing message ID' }, 400);

	const updatedMessage = context.get('requestBody');

	const updateWebsiteResponse = await updateMessage(String(token.id), messageId, updatedMessage);

	return context.json(
		updateWebsiteResponse.error
			? { error: updateWebsiteResponse.error }
			: updateWebsiteResponse.data,
		updateWebsiteResponse.status
	);
};

export const deleteMessageController = async (context: Context) => {
	const { token } = context.get('authUser');
	if (!token) return context.status(401);

	const { messageId } = context.req.param();
	if (!messageId) return context.json({ error: 'Missing message ID' }, 400);

	const deleteMessageResponse = await deleteMessage(String(token.id), messageId);

	return context.json(
		deleteMessageResponse.error
			? { error: deleteMessageResponse.error }
			: deleteMessageResponse.data,

		deleteMessageResponse.status
	);
};

const PartialInsertMessageSchema = InsertMessageSchema.pick({
	title: true,
	content: true,
	startTime: true
});

messagesRouter.use(verifyAuth());
messagesRouter.get('/:messageId', getMessageController);
messagesRouter.get('/', getMessagesController);
messagesRouter.post(
	'/:websiteId',
	validateRequestBody(PartialInsertMessageSchema),
	postMessageController
);
messagesRouter.put(
	'/:websiteId/:messageId',
	validateRequestBody(PartialInsertMessageSchema),
	putMessageController
);
messagesRouter.delete('/:messageId', deleteMessageController);
