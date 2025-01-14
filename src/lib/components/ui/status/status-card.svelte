<script lang="ts">
	import type { SelectPartialStatus } from '$lib/db/schema';
	import { selectedWebsiteIdStore, websiteStore } from '$lib/store/website.store';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import StatusBadge from '$lib/components/ui/status/status-badge.svelte';
	import StatusPageChart from '$lib/components/ui/status/status-page-chart.svelte';
	import StatusAvailability from '$lib/components/ui/status/status-availability.svelte';
	import StatusPerformance from '$lib/components/ui/status/status-performance.svelte';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { cn } from '$lib/utils';
	import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
	import { toast } from 'svelte-sonner';

	let {
		classProps = '',
		websiteId,
		showWebsiteFormDialog = $bindable(),
		showDeleteWebsiteDialog = $bindable(),
		showSettings = true,
		demoStatuses = []
	} = $props();

	let statuses: SelectPartialStatus[] = $state([]);
	let loadingStatuses = $state(true);
	let website = $derived($websiteStore && websiteId ? $websiteStore.get(websiteId) : undefined);

	async function togglePauseWebsite() {
		if (website)
			await fetch(`/api/websites/${websiteId}`, {
				method: 'PUT',
				body: JSON.stringify({ paused: !website.paused, name: website.name, url: website.url })
			})
				.then(async (res) => {
					if (res.ok) {
						websiteStore.update((websiteMap) => {
							const updatedWebsite = { ...website, paused: !website.paused };
							toast.success(
								`Website ${updatedWebsite.paused ? 'paused' : 'resumed'} successfully!`
							);
							websiteMap.set(websiteId, updatedWebsite);
							return websiteMap;
						});
					} else {
						const resBody = await res.json();
						toast.error(resBody.error);
					}
				})
				.catch((err) => {
					console.error(err);
					toast.error('An error occurred. Please try again later.');
				});
	}

	async function loadWebsiteStatus(websiteId: string) {
		if (!websiteId) return;
		loadingStatuses = true;
		statuses =
			demoStatuses.length > 0
				? demoStatuses
				: await fetch(`/api/status/${websiteId}`).then((response) => response.json());

		loadingStatuses = false;
	}

	$effect(() => {
		loadWebsiteStatus(websiteId);
	});
</script>

{#if website}
	<Card.Root class={cn(classProps, 'inline-block w-full p-4')}>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="mr-2 text-lg font-medium">
					{website.name}
				</h2>
			</div>
			<div class="flex items-center space-x-4">
				{#if website.paused}
					<Badge variant="destructive">
						<TriangleAlert class="mr-1 size-3" />Paused
					</Badge>
				{:else if statuses?.length > 0}
					{@const latestStatus = statuses.at(-1)}
					{#if latestStatus}
						<StatusBadge status={latestStatus.status} />
					{/if}
				{/if}
				{#if showSettings}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button size="icon" variant="ghost" class="h-8 w-8">
								<EllipsisVertical class="h-3.5 w-3.5" />
								<span class="sr-only">More</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item
								onclick={() => {
									showWebsiteFormDialog = true;
									selectedWebsiteIdStore.set(websiteId);
								}}
							>
								Edit
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={togglePauseWebsite}>
								{website.paused ? 'Resume' : 'Pause'}
							</DropdownMenu.Item>
							<DropdownMenu.Item disabled={true}>Alerts (coming soon)</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item
								onclick={() => {
									showDeleteWebsiteDialog = true;
									selectedWebsiteIdStore.set(websiteId);
								}}>Delete</DropdownMenu.Item
							>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
			</div>
		</div>
		<div class="mb-4 text-xs text-muted-foreground">
			<a href={website.url} target="_blank" rel="noopener noreferrer">
				{website.url}
			</a>
		</div>
		{#if !loadingStatuses}
			<div class="mb-2 grid grid-cols-2 gap-2 divide-x rounded-lg border">
				<StatusAvailability {statuses} />
				<StatusPerformance {statuses} />
			</div>
			<div class="h-24 p-2">
				{#if statuses.length > 0}
					<StatusPageChart {statuses} />
				{:else}
					<div class="py-4 text-center">No data available! :(</div>
				{/if}
			</div>
		{:else}
			<div class="flex h-40 w-full items-center justify-center">
				<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
			</div>
		{/if}
	</Card.Root>
{/if}
