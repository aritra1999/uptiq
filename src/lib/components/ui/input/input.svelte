<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		label,
		value = $bindable(),
		class: className,
		...restProps
	}: WithElementRef<HTMLInputAttributes & { label: string }> = $props();
</script>

<div
	class="w-full rounded-lg border border-input bg-transparent px-4 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
>
	<div class="text-xs font-semibold text-muted-foreground">
		{label}
		<span class="text-red-500">
			{#if restProps['required']}*{/if}
		</span>
	</div>
	<input
		bind:this={ref}
		class={cn('w-full bg-transparent text-sm outline-none ring-0', className)}
		bind:value
		{...restProps}
	/>
</div>
