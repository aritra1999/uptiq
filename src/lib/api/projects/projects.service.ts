import { db } from '$lib/db/drizzle';
import { and, count, eq } from 'drizzle-orm';
import { projects, type InsertProject, type SelectProjectPartial } from '$lib/db/schema';
import { isUserPro } from '../user/user.service';
import type { ServiceResponse } from '../types';
import { prettifyErrors } from '$lib/db/utils';
import type { StatusCode } from 'hono/utils/http-status';

export const canUserCreateProject = async (userId: string): Promise<boolean> => {
	if (await isUserPro(userId)) return true;

	const projectsCount = await db
		.select({ count: count(projects.id) })
		.from(projects)
		.where(eq(projects.userId, userId));

	return projectsCount[0].count < 2;
};

export const getAllProjects = async (userId: string): Promise<SelectProjectPartial[]> => {
	return db
		.select({
			id: projects.id,
			name: projects.name,
			description: projects.description,
			slug: projects.slug
		})
		.from(projects)
		.where(eq(projects.userId, userId));
};

export const getProjectBySlug = async (
	userId: string,
	projectSlug: string
): Promise<SelectProjectPartial | null> => {
	const projectResponse = await db
		.select({
			id: projects.id,
			name: projects.name,
			description: projects.description,
			slug: projects.slug
		})
		.from(projects)
		.where(and(eq(projects.userId, userId), eq(projects.slug, projectSlug)))
		.limit(1);

	return projectResponse[0];
};

export const createProject = async (
	project: InsertProject
): Promise<ServiceResponse<SelectProjectPartial>> => {
	if (!(await canUserCreateProject(project.userId))) {
		return {
			status: 403,
			error: 'Hobby users can create 2 projects!'
		};
	}

	try {
		const result = await db.insert(projects).values(project).returning({
			id: projects.id,
			name: projects.name,
			description: projects.description,
			slug: projects.slug
		});
		return {
			status: 200,
			data: result[0]
		};
	} catch (err) {
		return {
			status: 400,
			error: prettifyErrors(err as Error)
		};
	}
};

export const updateProject = async (
	userId: string,
	slug: string,
	updatedProjectInput: InsertProject
): Promise<ServiceResponse<SelectProjectPartial>> => {
	const project = await getProjectBySlug(userId, slug);

	if (!project)
		return {
			status: 404,
			error: 'Project not found'
		};

	return await db
		.update(projects)
		.set(updatedProjectInput)
		.where(and(eq(projects.userId, userId), eq(projects.slug, slug)))
		.returning({
			id: projects.id,
			name: projects.name,
			description: projects.description,
			slug: projects.slug
		})
		.then((response) => {
			return {
				status: 200 as StatusCode,
				data: response[0]
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: error.message
			};
		});
};

export const deleteProject = async (
	userId: string,
	slug: string
): Promise<ServiceResponse<{ deletedId: string }>> => {
	return await db
		.delete(projects)
		.where(and(eq(projects.userId, userId), eq(projects.slug, slug)))
		.returning({ deletedId: projects.id })
		.then((response) => {
			if (response.length === 0)
				return {
					status: 404 as StatusCode,
					error: 'Project not found'
				};
			return {
				status: 200 as StatusCode,
				data: response[0]
			};
		})
		.catch((error) => {
			return {
				status: 400 as StatusCode,
				error: error.message
			};
		});
};
