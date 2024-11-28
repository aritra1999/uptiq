<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		label,
		children,
		...restProps
	}: WithoutChild<SelectPrimitive.TriggerProps & { label: string }> = $props();
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		'flex  w-full items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-3 py-2  ring-offset-background focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&>span]:line-clamp-1',
		className
	)}
	{...restProps}
>
	<div class="text-left">
		<div class="text-xs font-semibold text-muted-foreground">
			{label}
		</div>
		<div class="text-sm">
			{@render children?.()}
		</div>
	</div>
	<ChevronDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
