<script lang="ts">
	import type { SelectPartialStatus } from '$lib/db/schema';
	import { prettifyDate } from '$lib/utils';
	import * as Card from '$lib/components/ui/card';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import StatusBadge from '$lib/components/ui/status/status-badge.svelte';
	import StatusAvailability from '$lib/components/ui/status/status-availability.svelte';
	import StatusPerformance from '$lib/components/ui/status/status-performance.svelte';
	import StatusPageChart from '$lib/components/ui/status/status-page-chart.svelte';
	import type { StatusPageMessages } from '$lib/api/types';
	import Calendar from 'lucide-svelte/icons/calendar';

	interface StatusPageItem {
		name: string;
		url: string;
		statuses: SelectPartialStatus[];
		messages: StatusPageMessages[];
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
	<div class=" flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-8">
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
	{#if statusPageItem.messages.length > 0}
		<div class="mt-4">
			<Accordion.Root
				type="single"
				value={statusPageItem.name}
				class="w-full rounded-lg bg-sidebar px-4"
			>
				<Accordion.Item value={statusPageItem.name}>
					<Accordion.Trigger>Messages</Accordion.Trigger>
					<Accordion.Content>
						<ol class="relative ms-4 border-s">
							{#each statusPageItem.messages as message}
								<li class="mb-6 ms-4 px-4">
									<span
										class="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent dark:ring-gray-900"
									>
										<Calendar class="size-3" />
									</span>
									<div class="mb-2 flex items-center space-x-2">
										<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
											{message.title}
										</h3>
										<time class="block text-xs font-normal leading-none text-muted-foreground">
											{prettifyDate(new Date(message.startTime))}
										</time>
									</div>
									<p class="text-sm">
										{message.content}
									</p>
								</li>
							{/each}
						</ol>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
	{/if}
</Card.Root>
