<script lang="ts">
	import { metaStore } from '$lib/store/meta.store';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { Button } from '$lib/components/ui/button';
	import Sidebar from '$lib/components/ui/sidebar/sidebar.svelte';
	import { page } from '$app/stores';
	import AlignLeft from 'lucide-svelte/icons/align-left';

	page.subscribe(() => {
		$metaStore.showDashboardSidebar = false;
	});
</script>

{#if $metaStore.isSmallScreen}
	<nav>
		<Sheet.Root bind:open={$metaStore.showDashboardSidebar}>
			<Sheet.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="icon"
					class="fixed left-0 top-[3.75rem] rounded-l-none border-l-0"
				>
					<AlignLeft class="h-4 w-4" />
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left" class="w-screen p-0">
				<Sidebar />
			</Sheet.Content>
		</Sheet.Root>
	</nav>
{:else}
	<nav class="w-3/12 min-w-72 max-w-96">
		<Sidebar />
	</nav>
{/if}
