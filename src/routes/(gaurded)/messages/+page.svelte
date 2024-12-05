<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';
	import Header from '$lib/components/ui/page/header.svelte';
	import MessageForm from '$lib/components/ui/messages/message-form.svelte';
	import MessageDelete from '$lib/components/ui/messages/message-delete.svelte';
	import { messageStore, selectedMessageStore } from '$lib/store/message.store';
	import { prettifyDate } from '$lib/utils.js';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import X from 'lucide-svelte/icons/x';

	let { data } = $props();
	let showMessageFormDialog = $state(false);
	let showDeleteMessageDialog = $state(false);

	$effect(() => {
		const messages = data.messages;
		if (messages) messageStore.set(messages);
	});
</script>

<section class="flex items-center justify-between">
	<div class="flex items-center space-x-4">
		<Header title="Messages" />
		{#if data.selectedWebsite}
			<div class="flex items-center rounded-lg bg-sidebar py-2 pl-4 text-xs">
				<div class="pb-0.5">
					<span class="text-muted-foreground">Selected website: </span>
					{data.websites.find((website) => website.id === data.selectedWebsite).name}
				</div>
				<Button variant="link" href="/messages" class="h-4">
					<X class="size-2 " />
				</Button>
			</div>
		{/if}
	</div>
	<div class="space-x-2">
		<Button
			onclick={() => {
				showMessageFormDialog = true;
				selectedMessageStore.set(null);
			}}
		>
			Add Message
		</Button>
	</div>
</section>
<section>
	{#if $messageStore === undefined}
		<p>Loading projects...</p>
	{:else if $messageStore.size === 0}
		<p>No messages found. Click "Add Message" to create your first message.</p>
	{:else}
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Website</Table.Head>
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
							<Table.Cell class="w-52">
								{data.websites.find((website) => website.id === message.websiteId).name}
							</Table.Cell>
							<Table.Cell class="w-52">{message.title}</Table.Cell>
							<Table.Cell>{message.content}</Table.Cell>
							<Table.Cell class="w-32">{prettifyDate(new Date(message.startTime))}</Table.Cell>
							<Table.Cell class="w-32 space-x-2">
								<Button
									variant="secondary"
									size="icon"
									onclick={() => {
										showMessageFormDialog = true;
										selectedMessageStore.set(message.id);
									}}
								>
									<Pencil class="size-3" />
								</Button>
								<Button
									variant="destructive"
									size="icon"
									onclick={() => {
										showDeleteMessageDialog = true;
										selectedMessageStore.set(message.id);
									}}
								>
									<Trash2 class="size-3" />
								</Button>
							</Table.Cell>
						</Table.Row>
					{/if}
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
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
		<MessageForm bind:showMessageFormDialog bind:websites={data.websites} />
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
