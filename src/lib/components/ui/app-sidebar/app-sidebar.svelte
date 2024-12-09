<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Logo from '$lib/components/ui/logo/logo.svelte';
	import NavUser from '$lib/components/ui/app-sidebar/nav-user.svelte';
	import ThemeSwitcher from '$lib/components/ui/theme/theme-switcher.svelte';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { projectStore } from '$lib/store/project.store';
	import Bug from 'lucide-svelte/icons/bug';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import MessageSquareHeart from 'lucide-svelte/icons/message-square-heart';

	let {
		ref = $bindable(null),
		collapsible = 'offcanvas',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header class="my-6">
		<Logo />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				<Collapsible.Root open={true} class="group/collapsible">
					{#snippet child({ props })}
						<Sidebar.MenuItem {...props}>
							<Collapsible.Trigger>
								{#snippet child({ props })}
									<Sidebar.MenuButton {...props}>
										<a href="/projects">Projects</a>
										<ChevronRight
											class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/snippet}
							</Collapsible.Trigger>
							<Collapsible.Content>
								{#if $projectStore}
									{@const projects = $projectStore.values()}
									<Sidebar.MenuSub>
										{#each projects as project}
											<Sidebar.MenuSubItem>
												<Sidebar.MenuSubButton>
													{#snippet child({ props })}
														<a href="/projects/{project.slug}" {...props}>
															<span>{project.name}</span>
														</a>
													{/snippet}
												</Sidebar.MenuSubButton>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								{/if}
							</Collapsible.Content>
						</Sidebar.MenuItem>
					{/snippet}
				</Collapsible.Root>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href="/messages" {...props}>Messages</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href="/settings" {...props}>Settings</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Alert.Root class="p-2">
			<a href="/404">
				<div class="rounded-lg p-2 pb-3 hover:bg-sidebar-accent">
					<Alert.Title class="flex items-center space-x-2 text-blue-500">
						<MessageSquareHeart strokeWidth={2.5} class="size-4  animate-bounce" />
						<span>Got feedback?</span>
					</Alert.Title>
					<Alert.Description>We'd love to hear what you have to say about uptiq!</Alert.Description>
				</div>
			</a>
			<hr />
			<a href="/404">
				<div class="rounded-lg p-2 pt-3 hover:bg-sidebar-accent">
					<Alert.Title class="flex items-center space-x-2 text-red-400">
						<Bug strokeWidth={2.5} class="size-4" />
						<span>Found a bug?</span>
					</Alert.Title>
					<Alert.Description>Report and we'll squash them asap 😎!</Alert.Description>
				</div>
			</a>
		</Alert.Root>
		<ThemeSwitcher />
		<NavUser />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
