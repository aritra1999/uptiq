<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/ui/app-sidebar/app-sidebar.svelte';
	import { projectStore } from '$lib/store/project.store';

	let { data, children } = $props();

	$effect(() => {
		const projects = data.projects;
		if (projects) projectStore.set(projects);
	});
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
		<Sidebar.Trigger />
		<section class="container mx-auto">
			{@render children()}
		</section>
	</main>
</Sidebar.Provider>
