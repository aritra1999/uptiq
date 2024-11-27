<script lang="ts">
	import { projectStore, selectedProjectIdStore } from '$lib/store/project.store';
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let { showDeleteProjectDialog = $bindable() } = $props();
	let loading = $state(false);
	let selectedProject = $projectStore.get($selectedProjectIdStore ?? '');

	const deleteProject = async () => {
		if (!selectedProject) return;

		loading = true;
		await fetch(`/api/projects/${selectedProject.slug}`, { method: 'DELETE' }).then(() => {
			showDeleteProjectDialog = false;

			projectStore.update((projectMap) => {
				projectMap.delete(selectedProject.id);
				return projectMap;
			});
		});

		loading = false;
	};
</script>

{#if selectedProject}
	<div>
		<div class="mb-4">
			Delete - {selectedProject.name} ({selectedProject.slug})?
		</div>
		<Button variant="destructive" onclick={deleteProject}>
			Confirm
			{#if loading}
				<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
			{/if}
		</Button>
	</div>
{/if}
