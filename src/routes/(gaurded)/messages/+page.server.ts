import type { SelectMessagePartial } from '$lib/db/schema';

export const load = async ({ fetch, url }) => {
	let requestUrl = '/api/messages';

	const websiteId = url.searchParams.get('websiteId');
	if (websiteId) {
		requestUrl += `?websiteId=${websiteId}`;
	}

	const messages: Map<string, SelectMessagePartial> | null = await fetch(requestUrl)
		.then((res: Response) => res.json())
		.then((messages: SelectMessagePartial[]) => {
			if (!messages) return null;
			return new Map(
				messages.map((message: SelectMessagePartial) => [String(message.id), message])
			);
		})
		.catch((err: Error) => {
			console.log(err);
			return null;
		});

	const websites = await fetch('/api/websites')
		.then((res: Response) => res.json())
		.catch((err: Error) => {
			console.log(err);
			return [];
		});

	return {
		messages,
		websites,
		selectedWebsite: websiteId
	};
};
