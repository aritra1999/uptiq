import { writable } from 'svelte/store';

export const metaStore = writable({
	isSmallScreen: true,
	showDashboardSidebar: false
});
