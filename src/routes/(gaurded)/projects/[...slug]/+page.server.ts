import type { SelectProject, SelectWebsitePartial } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const project: SelectProject = await fetch(`/api/projects/${params.slug}`, {
		method: 'GET'
	})
		.then((response) => response.json())
		.then((project) => {
			if (project.error) throw error(400, project.error);
			return project;
		});

	const websites: Map<string, SelectWebsitePartial> = await fetch(`/api/websites/${params.slug}`, {
		method: 'GET'
	})
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
