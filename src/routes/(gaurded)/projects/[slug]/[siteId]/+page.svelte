<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Header from '$lib/components/ui/page/header.svelte';
	import StatusChart from '$lib/components/ui/status/status-chart.svelte';
	import MessageForm from '$lib/components/ui/messages/message-form.svelte';
	import MessageDelete from '$lib/components/ui/messages/message-delete.svelte';
	import StatusAvailability from '$lib/components/ui/status/status-availability.svelte';
	import StatusPerformance from '$lib/components/ui/status/status-performance.svelte';
	import StatusBadge from '$lib/components/ui/status/status-badge.svelte';
	import type { SelectMessagePartial, SelectPartialStatus } from '$lib/db/schema';
	import { onMount } from 'svelte';
	import { messageStore, selectedMessageStore } from '$lib/store/message.store';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import { Button } from '$lib/components/ui/button';
	import { prettifyDate } from '$lib/utils';

	let { data } = $props();
	let statuses: SelectPartialStatus[] = $state([]);
	let loadingStatus = $state(true);
	let loadingMessages = $state(true);

	let showMessageFormDialog = $state(false);
	let showDeleteMessageDialog = $state(false);

	onMount(async () => {
		if (!data.website) return;

		statuses = await fetch(`/api/status/${data.website.id}?limit=150`)
			.then(async (res) => await res.json())
			.catch((err: Error) => {
				console.log(err);
				return [];
			})
			.finally(() => {
				loadingStatus = false;
			});

		await fetch(`/api/messages?websiteId=${data.website.id}`)
			.then((res: Response) => res.json())
			.then((messages: SelectMessagePartial[]) => {
				if (!messages) return null;
				const messagesMap = new Map(
					messages.map((message: SelectMessagePartial) => [String(message.id), message])
				);
				if (messages) messageStore.set(messagesMap);
				return messagesMap;
			})
			.catch((err: Error) => {
				console.log(err);
				return null;
			})
			.finally(() => {
				loadingMessages = false;
			});
	});
</script>

{#if data.website}
	<section class="flex items-center justify-between">
		<Header title={data.website.name} description={data.website.url} />
		<Button
			onclick={() => {
				showMessageFormDialog = true;
				selectedMessageStore.set(null);
			}}
		>
			Add Message
		</Button>
	</section>
	<section>
		<Card.Root class="mb-6 p-6">
			{#if loadingStatus}
				<p class="p-2 text-center">Loading statuses...</p>
			{:else if statuses.length === 0}
				<p class="p-2 text-center">No status found.</p>
			{:else if !loadingStatus && statuses.length > 0}
				<div class="mb-4 flex items-start justify-between">
					<div class="grid w-96 grid-cols-2 gap-2 divide-x rounded-lg border">
						<StatusAvailability {statuses} />
						<StatusPerformance {statuses} />
					</div>
					<div>
						{#if statuses?.length > 0}
							{@const latestStatus = statuses.at(-1)}
							{#if latestStatus}
								<StatusBadge status={latestStatus.status} />
							{/if}
						{/if}
					</div>
				</div>
				<div class="h-full w-full">
					<StatusChart {statuses} />
				</div>
			{/if}
		</Card.Root>
	</section>
	<section>
		<Card.Root class="p-2">
			{#if loadingMessages}
				<p class="p-6 text-center">Loading messages...</p>
			{:else if $messageStore && $messageStore.size > 0}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Title</Table.Head>
							<Table.Head>Content</Table.Head>
							<Table.Head>Start Time</Table.Head>
							<Table.Head></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each Array.from($messageStore.keys()) as messageId}
							{@const message = $messageStore.get(messageId)}
							{#if message}
								<Table.Row>
									<Table.Cell class="w-52">{message.title}</Table.Cell>
									<Table.Cell>{message.content}</Table.Cell>
									<Table.Cell class="w-60">{prettifyDate(new Date(message.startTime))}</Table.Cell>
									<Table.Cell class="w-8 space-x-2">
										<DropdownMenu.Root>
											<DropdownMenu.Trigger>
												<Button size="icon" variant="ghost" class="h-8 w-8">
													<EllipsisVertical class="h-3.5 w-3.5" />
													<span class="sr-only">More</span>
												</Button>
											</DropdownMenu.Trigger>
											<DropdownMenu.Content align="end">
												<DropdownMenu.Item
													onclick={() => {
														showMessageFormDialog = true;
														selectedMessageStore.set(message.id);
													}}
												>
													Edit
												</DropdownMenu.Item>
												<DropdownMenu.Separator />
												<DropdownMenu.Item
													onclick={() => {
														showDeleteMessageDialog = true;
														selectedMessageStore.set(message.id);
													}}
												>
													Delete
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							{/if}
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<p class="p-6 text-center">
					No messages found. Click "Add Message" to create your first message.
				</p>
			{/if}
		</Card.Root>
	</section>
	<Dialog.Root bind:open={showMessageFormDialog}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{$selectedMessageStore ? 'Update' : 'Add'} Message</Dialog.Title>
				<Dialog.Description>
					{$selectedMessageStore
						? 'Update the details of this message.'
						: 'Enter the details for a new message.'}
				</Dialog.Description>
			</Dialog.Header>
			<MessageForm bind:showMessageFormDialog websiteId={data.website.id} />
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={showDeleteMessageDialog}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Delete Message</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to delete this message? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<MessageDelete bind:showDeleteMessageDialog />
		</Dialog.Content>
	</Dialog.Root>
{/if}
