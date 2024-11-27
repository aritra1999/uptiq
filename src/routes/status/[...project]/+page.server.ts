import type { SelectProject } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const project: SelectProject = await fetch(`/api/status/project/${params.project}`)
		.then(async (response) => {
			try {
				const projectResponse = await response.json();
				if (!response.ok) throw error(response.status, projectResponse.error);
				return projectResponse;
			} catch (err) {
				throw error(response.status, err.body.message ?? 'Error loading project!');
			}
		})
		.then((project) => {
			if (project.error) throw error(400, project.error);
			return project;
		});

	return { project };
}) satisfies PageServerLoad;
