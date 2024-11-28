<script lang="ts">
	import type { SelectPartialStatus } from '$lib/db/schema';
	import * as Card from '$lib/components/ui/card';
	import StatusBadge from '$lib/components/ui/status/status-badge.svelte';
	import StatusAvailability from '$lib/components/ui/status/status-availability.svelte';
	import StatusPerformance from '$lib/components/ui/status/status-performance.svelte';
	import StatusPageChart from '$lib/components/ui/status/status-page-chart.svelte';

	interface StatusPageItem {
		name: string;
		url: string;
		statuses: SelectPartialStatus[];
	}

	interface Props {
		statusPageItem: StatusPageItem;
	}

	let { statusPageItem }: Props = $props();
	let statuses = $derived(statusPageItem?.statuses ?? []);
</script>

<Card.Root class="z-40 mb-4 h-full w-full p-4 sm:p-6 ">
	<div class="mb-3">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-medium">
				{statusPageItem.name}
			</h2>
			{#if statuses?.length > 0}
				{@const latestStatus = statuses.at(-1)}
				{#if latestStatus}
					<StatusBadge status={latestStatus.status} />
				{/if}
			{/if}
		</div>
	</div>
	<div class="flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-8">
		<div class="w-full sm:w-1/2">
			<div class="mb-2">
				<a
					href={statusPageItem.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`Visit status page for ${statusPageItem.name} (opens in new tab)`}
					class="text-sm text-muted-foreground hover:underline"
				>
					{statusPageItem.url}
				</a>
			</div>
			<div class="grid h-16 grid-cols-2 gap-2 divide-x rounded-lg border">
				<StatusAvailability {statuses} />
				<StatusPerformance {statuses} />
			</div>
		</div>
		<div class="w-full sm:w-1/2">
			{#if statuses.length > 0}
				<StatusPageChart {statuses} />
			{:else}
				<p class="text-muted-foreground">No data available</p>
			{/if}
		</div>
	</div>
</Card.Root>
