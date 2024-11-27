<script lang="ts">
	import type { SelectWebsiteStatusCard } from '$lib/db/schema';
	interface Props {
		website: SelectWebsiteStatusCard;
	}

	let { website }: Props = $props();
</script>

<div class="p-3">
	<h4 class="text-xs text-muted-foreground">Check Every</h4>
	<h2 class="text-xl">
		{website.checkInterval}
		<span class="text-sm">
			{#if website.checkInterval === 1}min{:else}mins{/if}
		</span>
	</h2>
</div>
