import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { SelectProjectPartial } from '$lib/db/schema';

export const load: LayoutServerLoad = async ({ fetch, parent }) => {
	const { session } = await parent();

	if (!session) {
		throw redirect(302, '/');
	}

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

	return { session, projects };
};
