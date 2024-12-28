import type { SelectWebsitePartial } from '$lib/db/schema';
import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const website: SelectWebsitePartial = await fetch(`/api/websites/${params.siteId}`, {
		method: 'GET'
	})
		.then((response) => {
			if (!response.ok) throw error(response.status, response.statusText);
			return response.json();
		})
		.catch((error) => {
			console.log(error);
			return null;
		});

	return { website };
}) satisfies PageServerLoad;
