<script lang="ts">
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { navLinks } from './constants';

	$: isActive = (href: string): boolean => {
		return $page.url.pathname.split('/')[1] === `${href}`;
	};

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<div
	class="flex h-[calc(100vh-5rem)] w-full flex-col justify-between overflow-y-auto border-r py-12"
>
	<div>
		{#each navLinks as link}
			<a
				aria-current={isActive(link.href) ? 'page' : undefined}
				href="/{link.href}"
				class={cn('mx-6 flex items-center bg-transparent px-5 py-3')}
			>
				<svelte:component this={link.icon} class="mr-3 h-5 w-5" />
				<span>{link.title}</span>
			</a>
		{/each}
	</div>
</div>

<style>
	a[aria-current='page'] {
		@apply rounded-xl bg-neutral-800 text-white;
		view-transition-name: active-page;
	}
</style>
