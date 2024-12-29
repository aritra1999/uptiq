<script lang="ts">
	import { Tally4 } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	let { variant = 'dark' } = $props();
</script>

<a
	href="/"
	class={cn(
		'flex h-12 w-fit items-center rounded-full border px-6 text-lg font-semibold',
		variant === 'dark' ? 'bg-background text-foreground' : 'bg-foreground text-background'
	)}
>
	<Tally4 strokeWidth="3" class="mr-3 h-6 w-6 text-indigo-700" />
	<span class="pb-1">uptiq</span>
</a>
