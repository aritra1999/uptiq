import type { SelectPartialStatus, SelectWebsitePartial } from '$lib/db/schema';
import type { StatusCode } from 'hono/utils/http-status';

export type StatusPageResponse = SelectWebsitePartial & { statuses: SelectPartialStatus[] };

export type ServiceResponse<T> = {
	data?: T;
	error?: string;
	status: StatusCode;
};
