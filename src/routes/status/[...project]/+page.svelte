<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import StatusPageCard from '$lib/components/ui/status/status-page-card.svelte';
	import type { StatusPageResponse } from '$lib/api/types.js';

	interface Props {
		data: { project: { id: string; name: string; description: string } };
	}

	let { data }: Props = $props();

	let loadingStatusPage = $state(true);
	let statusPageItems: StatusPageResponse[] = $state([]);
	let operationalStatus = $state('');

	onMount(async () => {
		if (!data.project) return;
		statusPageItems = await fetch(`/api/status/page/${data.project.id}`)
			.then(async (response) => await response.json())
			.finally(() => {
				loadingStatusPage = false;
			});

		const total = statusPageItems.length;
		const operational = statusPageItems.filter(
			(statusPageItem) =>
				statusPageItem.statuses &&
				statusPageItem.statuses.length > 0 &&
				statusPageItem.statuses[statusPageItem.statuses.length - 1].status === 'up'
		).length;

		operationalStatus = `${operational} / ${total}`;
	});
</script>

{#if data.project}
	<div class="absolute left-0 top-0 z-10 h-32 w-screen border-b bg-sidebar-accent"></div>
	<main class="container mx-auto max-w-4xl pt-20">
		<section class="mb-4 flex gap-4">
			<Card.Root class="z-40  w-2/3 p-4 sm:p-6">
				<h1 class="mb-2 text-2xl">{data.project.name}</h1>
				<p class="text-sm">{data.project.description}</p>
			</Card.Root>
			<Card.Root class="z-40 flex w-1/3 items-center justify-center px-6 py-4 sm:px-8 ">
				<div>
					{#if !loadingStatusPage}
						<div class="text-3xl">{operationalStatus}</div>
						<div class="text-sm text-muted-foreground">Operational</div>
					{/if}
				</div>
			</Card.Root>
		</section>
		<section>
			{#if loadingStatusPage}
				<Skeleton class="mb-4 h-48 w-full" />
				<Skeleton class="mb-4 h-48 w-full" />
				<Skeleton class="h-48 w-full" />
			{:else}
				<div class="z-40 space-y-4">
					{#each statusPageItems as statusPageItem}
						<StatusPageCard {statusPageItem} />
					{/each}
				</div>
			{/if}
		</section>
		<div class="my-2 text-center text-xs">
			Powered by <a href="https://uptiq.vercel.app" class="underline"> uptiq </a>
		</div>
	</main>
{/if}
