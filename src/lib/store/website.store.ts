import type { SelectWebsitePartial } from '$lib/db/schema';
import { writable } from 'svelte/store';

export const websiteStore = writable<Map<string, SelectWebsitePartial>>();
export const selectedWebsiteIdStore = writable<string | null>(null);
export const websiteMapStore =
	writable<Map<string, { projectName: string; websiteName: string }>>();
