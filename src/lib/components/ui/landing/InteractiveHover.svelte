<script lang="ts">
	import { cn } from '$lib/utils';
	import { ArrowRight } from 'lucide-svelte';

	export { _class as class };
	export let text: string = 'Button';

	let _class: string = '';
</script>

<button
	class={cn(
		'group relative w-48 cursor-pointer overflow-hidden rounded-lg border bg-background px-2 py-3 text-center font-semibold',
		_class
	)}
	{...$$restProps}
>
	<span
		class="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
	>
		{text}
	</span>
	<div
		class="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100"
	>
		<span>{text}</span>
		<ArrowRight />
	</div>
	<div
		class="absolute left-[12%] top-[42%] h-2 w-2 scale-[1] rounded-lg bg-primary transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8] group-hover:bg-primary"
	></div>
</button>
