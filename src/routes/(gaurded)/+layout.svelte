<script lang="ts">
	import { cn } from '$lib/utils';
	import { metaStore } from '$lib/store/meta.store';
	import Navbar from '$lib/components/ui/navbar/navbar.svelte';
	import SideBar from '$lib/components/ui/sidebar/container.svelte';
</script>

<Navbar />
<main
	class={cn(
		'fancy-background h-[calc(100vh-5rem)] w-screen overflow-hidden border-t',
		$metaStore.isSmallScreen ? '' : 'flex'
	)}
>
	<div class="container mx-auto flex">
		<SideBar />
		<div class="p-4">
			<slot />
		</div>
	</div>
</main>
