import type { SelectProjectPartial } from '$lib/db/schema';
import { writable } from 'svelte/store';

export const projectStore = writable<Map<string, SelectProjectPartial>>();
export const selectedProjectIdStore = writable<string | null>(null);
