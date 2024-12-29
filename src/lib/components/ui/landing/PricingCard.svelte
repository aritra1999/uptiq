<script lang="ts">
	import Sparkles from 'lucide-svelte/icons/sparkles';

	let { plan } = $props();
</script>

<div class="h-full w-full rounded-lg bg-background px-8 py-4 sm:w-1/2">
	<div class="flex items-center justify-between">
		<div class="my-4">
			<span class="text-3xl font-bold">
				${plan.price}
			</span>
			<span class="text-muted-foreground"> per month </span>
		</div>
		<div
			class="flex items-center gap-2 rounded-lg bg-lime-300 px-4 py-1 font-semibold text-neutral-900"
		>
			{plan.name}
			{#if plan.name === 'Pro'}
				<Sparkles class="size-4" />
			{/if}
		</div>
	</div>
	<ul>
		{#each plan.features as feature}
			<li class="mb-2 flex items-center">
				<svg
					class="mr-2 h-5 w-5 text-green-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"
					></path>
				</svg>
				{feature}
			</li>
		{/each}
	</ul>
</div>
