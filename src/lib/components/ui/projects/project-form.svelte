<script lang="ts">
	import { projectStore, selectedProjectIdStore } from '$lib/store/project.store';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let { showProjectFormDialog = $bindable() } = $props();
	let selectedProject = $selectedProjectIdStore
		? $projectStore.get($selectedProjectIdStore)
		: undefined;
	let name = $state(selectedProject ? selectedProject.name : '');
	let slug = $state(selectedProject ? selectedProject.slug : '');
	let description = $state(selectedProject ? selectedProject.description : '');
	let formError = $state('');
	let loading = $state(false);

	const handleSubmit = async (event: Event): Promise<void> => {
		event.preventDefault();
		loading = true;

		const url = selectedProject ? `/api/projects/${selectedProject.slug}` : '/api/projects';
		await fetch(url, {
			method: selectedProject ? 'PUT' : 'POST',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, slug, description, id: selectedProject?.id })
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data.error) {
					formError = data.error;
					return;
				} else {
					projectStore.update((projectMap) => {
						projectMap.set(String(data.id), data);
						return projectMap;
					});
				}
				showProjectFormDialog = false;
			})
			.catch((err) => {
				console.log(err);
				formError = 'An error occurred. Please try again later.';
			});

		loading = false;
	};
</script>

<form onsubmit={handleSubmit} class="mt-4 space-y-4">
	{#if formError}
		<div class="mb-4 text-left">
			<div class="flex items-center border border-red-400 px-4 py-2 text-red-400">
				<CircleAlert class="mr-2 h-4 w-4" />
				{formError}
			</div>
		</div>
	{/if}
	<Input label="Name" id="name" bind:value={name} required />
	<Input label="Slug" id="slug" bind:value={slug} required />
	<Textarea
		label="Description"
		id="description"
		bind:value={description}
		data-gramm_editor="false"
		class="resize-none"
	/>
	<Button type="submit" disabled={loading}>
		Submit
		{#if loading}
			<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
		{/if}
	</Button>
</form>
