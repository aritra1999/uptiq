import type { SelectProject, SelectWebsitePartial } from '$lib/db/schema';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const project: SelectProject = await fetch(`/api/projects/${params.slug}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((project) => {
			return project;
		});

	const websites: Map<string, SelectWebsitePartial> = await fetch(
		`/api/websites?projectSlug=${params.slug}`,
		{
			method: 'GET'
		}
	)
		.then((response) => response.json())
		.then(
			(websites) =>
				new Map<string, SelectWebsitePartial>(
					websites.map((website: SelectWebsitePartial) => [String(website.id), website])
				)
		)
		.catch((error) => {
			console.log(error);
			return new Map();
		});

	return { project, websites };
}) satisfies PageServerLoad;
