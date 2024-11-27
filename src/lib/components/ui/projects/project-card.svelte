<script lang="ts">
	import { projectStore, selectedProjectIdStore } from '$lib/store/project.store';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import { cn } from '$lib/utils';

	let {
		projectId,
		showProjectFormDialog = $bindable(),
		showDeleteProjectDialog = $bindable()
	} = $props();
</script>

{#if projectId}
	{@const project = $projectStore.get(projectId)}
	{#if project}
		<a href="/projects/{project.slug}">
			<Card.Root class="relative inline-block w-full">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'absolute right-2 top-2')}
					>
						<EllipsisVertical class="h-3.5 w-3.5" />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Group>
								<DropdownMenu.Item
									onclick={() => {
										showProjectFormDialog = true;
										selectedProjectIdStore.set(project.id);
									}}
								>
									Edit
								</DropdownMenu.Item>
								<DropdownMenu.Item
									onclick={() => {
										showDeleteProjectDialog = true;
										selectedProjectIdStore.set(project.id);
									}}
								>
									Delete
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
				<div class="p-4">
					<div class="z-10 mb-3 whitespace-pre-wrap text-xl font-medium">{project.name}</div>
					<p class="h-16 text-sm">{project.description ?? ''}</p>
				</div>
				<a
					target="_blank"
					href="/status/{project.slug}"
					class="flex w-full items-center justify-between rounded-b-xl border-t border-sidebar-border bg-sidebar py-1.5"
				>
					<span class="px-2 text-xs text-muted-foreground">uptiq/status/{project.slug}</span>
				</a>
			</Card.Root>
		</a>
	{/if}
{/if}
