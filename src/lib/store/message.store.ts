import type { SelectMessagePartial } from '$lib/db/schema';
import { writable } from 'svelte/store';

export const messageStore = writable<Map<string, SelectMessagePartial>>();
export const selectedMessageStore = writable<string | null>(null);
