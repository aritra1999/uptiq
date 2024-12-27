<script lang="ts">
	import { page } from '$app/stores';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { websiteStore, selectedWebsiteIdStore } from '$lib/store/website.store';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { showWebsiteFormDialog = $bindable() } = $props();
	let loading = $state(false);
	let formError: string = $state('');
	let selectedWebsite = $selectedWebsiteIdStore
		? $websiteStore.get($selectedWebsiteIdStore)
		: undefined;
	let name = $state(selectedWebsite ? selectedWebsite.name : '');
	let url = $state(selectedWebsite ? selectedWebsite.url : '');

	const handleSubmit = async (event: Event): Promise<void> => {
		event.preventDefault();
		loading = true;
		const { slug } = $page.params;
		const URL = selectedWebsite ? `/api/websites/${selectedWebsite.id}` : `/api/websites/${slug}`;
		const websiteData = { name, url };

		await fetch(URL, {
			method: selectedWebsite ? 'PUT' : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(websiteData)
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data.error) {
					formError = data.error;
					return;
				} else {
					websiteStore.update((websiteMap) => {
						websiteMap.set(String(data.id), data);
						return websiteMap;
					});
				}
				showWebsiteFormDialog = false;
			})
			.catch((err) => {
				console.log(err);
				formError = 'An error occurred. Please try again later.';
			});

		loading = false;
	};
</script>

<form onsubmit={handleSubmit} class="my-4 space-y-4">
	{#if formError}
		<div class="mb-4 text-left">
			<div class="flex items-center border border-red-400 px-4 py-2 text-red-400">
				<CircleAlert class="mr-2 h-4 w-4" />
				{formError}
			</div>
		</div>
	{/if}
	<Input label="Name" id="name" bind:value={name} required />
	<Input label="Url" type="url" id="url" bind:value={url} required />

	<Button type="submit" disabled={loading}>
		Submit
		{#if loading}
			<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
		{/if}
	</Button>
</form>
