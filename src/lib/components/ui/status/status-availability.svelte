<script lang="ts">
	import type { SelectPartialStatus } from '$lib/db/schema';
	import { onMount } from 'svelte';

	interface Props {
		statuses?: SelectPartialStatus[];
	}

	let { statuses = [] }: Props = $props();
	let availability = $state(0);

	onMount(() => {
		const total = statuses.length;
		const up = statuses.filter(({ status }) => status === 'up').length;

		availability = total > 0 ? +((up / total) * 100).toFixed(2) : 0;
	});
</script>

<div class="px-4 py-2.5">
	<h4 class="text-xs text-muted-foreground">Availability</h4>
	<h2 class="text-xl">
		{availability}
		<span class="text-sm">%</span>
	</h2>
</div>
