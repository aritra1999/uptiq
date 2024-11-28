<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Header from '$lib/components/ui/page/header.svelte';
	import StatusCard from '$lib/components/ui/status/status-card.svelte';
	import { websiteStore, selectedWebsiteIdStore } from '$lib/store/website.store';
	import WebsiteForm from '$lib/components/ui/websites/website-form.svelte';
	import WebsiteDelete from '$lib/components/ui/websites/website-delete.svelte';

	let { data } = $props();

	let showWebsiteFormDialog = $state(false);
	let showDeleteWebsiteDialog = $state(false);

	$effect(() => {
		const websites = data.websites;
		if (websites) websiteStore.set(websites);
	});
</script>

<section class="flex items-center justify-between">
	<Header title={data.project.name} />
	<Button
		onclick={() => {
			showWebsiteFormDialog = true;
			selectedWebsiteIdStore.set(null);
		}}
	>
		Add Site
	</Button>
</section>
{#if $websiteStore === undefined}
	<p>Loading sites...</p>
{:else if $websiteStore.size === 0}
	<p>No websites found. Click "Add Site" to create your first website.</p>
{:else}
	<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each Array.from($websiteStore.keys()) as websiteId}
			<StatusCard {websiteId} bind:showWebsiteFormDialog bind:showDeleteWebsiteDialog />
		{/each}
	</div>
{/if}

<Dialog.Root bind:open={showWebsiteFormDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$selectedWebsiteIdStore ? 'Update' : 'Add'} Site</Dialog.Title>
			<Dialog.Description>
				{$selectedWebsiteIdStore
					? 'Update the details of your existing site.'
					: 'Enter the details for your new site.'}
			</Dialog.Description>
		</Dialog.Header>
		<WebsiteForm bind:showWebsiteFormDialog />
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showDeleteWebsiteDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Project</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete this website? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<WebsiteDelete bind:showDeleteWebsiteDialog />
	</Dialog.Content>
</Dialog.Root>
