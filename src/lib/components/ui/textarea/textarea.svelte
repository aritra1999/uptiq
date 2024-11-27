<script lang="ts">
	import type { WithElementRef, WithoutChildren } from 'bits-ui';
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		label,
		value = $bindable(),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes & { label: string }>> = $props();
</script>

<div
	class="w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
>
	<div class="mb-0.5 text-xs font-semibold text-muted-foreground">
		{label}
		<span class="text-red-500">
			{#if restProps['required']}
				*
			{/if}
		</span>
	</div>
	<textarea
		class={cn('min-h-24  w-full bg-transparent text-sm outline-none ring-0', className)}
		bind:value
		{...restProps}
	></textarea>
</div>
