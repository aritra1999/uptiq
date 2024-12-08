<script lang="ts">
	import type { SelectPartialStatus } from '$lib/db/schema';
	import { selectedWebsiteIdStore, websiteStore } from '$lib/store/website.store';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import StatusBadge from '$lib/components/ui/status/status-badge.svelte';
	import StatusChart from '$lib/components/ui/status/status-chart.svelte';
	import StatusAvailability from '$lib/components/ui/status/status-availability.svelte';
	import StatusPerformance from '$lib/components/ui/status/status-performance.svelte';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let {
		websiteId,
		showWebsiteFormDialog = $bindable(),
		showDeleteWebsiteDialog = $bindable(),
		showSettings = true,
		demoStatuses = []
	} = $props();

	let statuses: SelectPartialStatus[] = $state([]);
	let loadingStatuses = $state(true);
	let website = $derived($websiteStore && websiteId ? $websiteStore.get(websiteId) : undefined);

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
	<Card.Root class="inline-block w-full p-4">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="mr-2 text-lg font-medium">{website.name}</h2>
			</div>
			<div class="flex items-center space-x-4">
				{#if statuses?.length > 0}
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
								}}>Edit</DropdownMenu.Item
							>
							<a href="/messages?websiteId={websiteId}">
								<DropdownMenu.Item>Messages</DropdownMenu.Item>
							</a>
							<DropdownMenu.Item disabled={true}>Pause (coming soon)</DropdownMenu.Item>
							<DropdownMenu.Item disabled={true}>Subscribers (coming soon)</DropdownMenu.Item>
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
			<div>Pinging every {website.checkInterval} mins.</div>
			<a href={website.url} target="_blank" rel="noopener noreferrer">
				{website.url}
			</a>
		</div>
		{#if !loadingStatuses}
			<div class="mb-2 grid grid-cols-2 gap-2 divide-x rounded-lg border">
				<StatusAvailability {statuses} />
				<StatusPerformance {statuses} />
			</div>
			<div class="flex h-44 w-full items-center justify-center p-4">
				{#if statuses.length > 0}
					<div class="h-full w-full">
						<StatusChart {statuses} />
					</div>
				{:else}
					No data available! :(
				{/if}
			</div>
		{:else}
			<div class="flex h-40 w-full items-center justify-center">
				<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
			</div>
		{/if}
	</Card.Root>
{/if}
