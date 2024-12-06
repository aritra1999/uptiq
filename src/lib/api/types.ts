import type { SelectMessage, SelectPartialStatus, SelectWebsitePartial } from '$lib/db/schema';
import type { StatusCode } from 'hono/utils/http-status';

export type StatusPageMessages = Pick<SelectMessage, 'title' | 'content' | 'startTime'>;
export type StatusPageResponse = SelectWebsitePartial & {
	statuses: SelectPartialStatus[];
	messages: StatusPageMessages[];
};

export type ServiceResponse<T> = {
	data?: T;
	error?: string;
	status: StatusCode;
};
