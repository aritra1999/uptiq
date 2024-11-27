import type { SelectProjectPartial } from '$lib/db/schema';
import type { PageServerLoad } from '../../(auth)/signout/$types';

export const load = (async ({ fetch }) => {
	const projects: Map<string, SelectProjectPartial> | null = await fetch('/api/projects', {
		method: 'GET'
	})
		.then(async (response) => await response.json())
		.then((response) => {
			if (!response.projects) return null;
			return new Map(
				response.projects.map((project: SelectProjectPartial) => [String(project.id), project])
			);
		});

	return { projects };
}) satisfies PageServerLoad;
