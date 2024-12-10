<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { mode, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button onclick={toggleMode} variant="outline" class="justify-between border border-border">
	{#if $mode === 'light'}
		Light
		<Sun class="h-[1.2rem] w-[1.2rem]" />
	{:else}
		Dark
		<Moon class="h-[1.2rem] w-[1.2rem]" />
	{/if}
</Button>
