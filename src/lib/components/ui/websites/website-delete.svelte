<script lang="ts">
	import { websiteStore, selectedWebsiteIdStore } from '$lib/store/website.store';
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let { showDeleteWebsiteDialog = $bindable() } = $props();

	let loading = $state(false);
	let selectedWebsite = $websiteStore.get($selectedWebsiteIdStore ?? '');

	const deleteProject = async () => {
		if (!selectedWebsite) return;

		loading = true;
		await fetch(`/api/websites/${selectedWebsite.id}`, { method: 'DELETE' }).then(() => {
			showDeleteWebsiteDialog = false;

			websiteStore.update((websiteMap) => {
				websiteMap.delete(String(selectedWebsite.id));
				return websiteMap;
			});
		});

		loading = false;
	};
</script>

{#if selectedWebsite}
	<div>
		<div class="mb-4">
			Delete - {selectedWebsite.name}?
		</div>
		<Button variant="destructive" onclick={deleteProject}>
			Confirm
			{#if loading}
				<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
			{/if}
		</Button>
	</div>
{/if}
