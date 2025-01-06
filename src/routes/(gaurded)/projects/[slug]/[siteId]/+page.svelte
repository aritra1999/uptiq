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
	import type {
		SelectAlertLog,
		SelectAlertPartial,
		SelectMessagePartial,
		SelectPartialStatus
	} from '$lib/db/schema';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import { onMount } from 'svelte';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import { messageStore, selectedMessageStore } from '$lib/store/message.store';
	import { Button } from '$lib/components/ui/button';
	import { prettifyDate } from '$lib/utils';
	import SiteAlertForm from '$lib/components/ui/site-alert/site-alert-form.svelte';
	import SiteAlertDelete from '$lib/components/ui/site-alert/site-alert-delete.svelte';
	import SiteAlertTest from '$lib/components/ui/site-alert/site-alert-test.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { statusColorMap } from '$lib/components/ui/status/constants.js';

	let { data } = $props();
	let statuses: SelectPartialStatus[] = $state([]);
	let alert: SelectAlertPartial | null = $state(null);
	let alertLogs: SelectAlertLog[] = $state([]);

	let loadingStatus = $state(true);
	let loadingMessages = $state(true);
	let loadingAlerts = $state(true);
	let loadingAlertLogs = $state(true);

	let showMessageFormDialog = $state(false);
	let showDeleteMessageDialog = $state(false);
	let showAlertFormDialog = $state(false);
	let showDeleteAlertDialog = $state(false);

	onMount(async () => {
		if (!data.website) return;

		await fetch(`/api/status/${data.website.id}?limit=150`)
			.then(async (res) => await res.json())
			.then((statusRes) => {
				statuses = statusRes;
			})
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
		await fetch(`/api/alerts?websiteId=${data.website.id}`)
			.then((res: Response) => res.json())
			.then((alerts: SelectAlertPartial[]) => {
				if (!alerts) return null;
				alert = alerts[0];
			})
			.catch((err: Error) => {
				console.log(err);
				return null;
			})
			.finally(() => {
				loadingAlerts = false;
			});
		await fetch(`/api/alerts/logs/${data.website.id}`)
			.then(async (res: Response) => await res.json())
			.then((logs: SelectAlertLog[]) => {
				alertLogs = logs;
			})
			.catch((err: Error) => {
				console.log(err);
				return null;
			})
			.finally(() => {
				loadingAlertLogs = false;
			});
	});
</script>

{#if data.website}
	<section class="flex items-center justify-between">
		<Header title={data.website.name} description={data.website.url} />
	</section>
	<section class="mb-6 flex flex-col gap-6 sm:flex-row">
		<Card.Root class="h-80 w-full p-6 sm:w-1/2 md:w-2/3">
			{#if loadingStatus}
				<p class="p-2">Loading statuses...</p>
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
		<Card.Root class="w-full p-6 sm:w-1/2 md:w-1/3">
			{#if loadingAlerts}
				<p class="p-2">Loading alert...</p>
			{:else}
				<div class="mb-3 flex items-center justify-between border-b pb-3">
					<h3 class="text-2xl">Alert</h3>
					<div>
						{#if alert}
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
											showAlertFormDialog = true;
										}}
									>
										Edit
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item
										onclick={() => {
											showDeleteAlertDialog = true;
										}}
									>
										Delete
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<Button onclick={() => (showAlertFormDialog = true)}>Add Alerts</Button>
						{/if}
					</div>
				</div>
				<div class="flex h-full w-full justify-center">
					{#if alert}
						<div class="w-full">
							<div class="mb-6 space-y-3">
								<div class="flex items-center justify-between">
									<div class="text-muted-foreground">Type:</div>
									<div class="capitalize">{alert.type}</div>
								</div>
								<div class="flex items-center justify-between">
									<div class="text-muted-foreground">Status:</div>
									<div class="capitalize">
										{#if alert.enabled}
											<Badge
												variant="outline"
												class="border-none bg-opacity-20 px-3 py-1 text-xs font-medium"
												style="background: {statusColorMap['up'] + '30'};"
											>
												<div
													class="mr-2 h-2 w-2 rounded-full"
													style="background: {statusColorMap['up']};"
												></div>
												Enabled
											</Badge>
										{:else}
											<Badge
												variant="outline"
												class="border-none bg-opacity-20 px-3 py-1 font-medium"
												style="background: {statusColorMap['down'] + '30'};"
											>
												<div
													class="mr-2 h-2 w-2 rounded-full"
													style="background: {statusColorMap['down']};"
												></div>
												Disabled
											</Badge>
										{/if}
									</div>
								</div>
							</div>
							<div class="mb-6 rounded-lg bg-secondary px-4 py-2">
								<div class="text-muted-foreground">Target:</div>
								<code class="block h-fit max-w-[400px] truncate text-sm">{alert.target}</code>
							</div>
							<div class="flex justify-end">
								<SiteAlertTest bind:websiteId={data.website.id} bind:alertLogs />
							</div>
						</div>
					{:else}
						<p class="pt-10">No alert found!</p>
					{/if}
				</div>
			{/if}
		</Card.Root>
	</section>
	<section class="mb-6">
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-2xl">Messages</h3>
			<Button
				onclick={() => {
					showMessageFormDialog = true;
					selectedMessageStore.set(null);
				}}
			>
				Add Message
			</Button>
		</div>
		<Card.Root class=" p-2">
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
	<section>
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-2xl">
				Alert Logs
				<span class="text-base text-muted-foreground">(last 7 days)</span>
			</h3>
		</div>
		<Card.Root class="mb-6 p-2">
			{#if loadingAlertLogs}
				<p class="p-6 text-center">Loading aleert logs for the last 7 days...</p>
			{:else if alertLogs.length > 0}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Sent</Table.Head>
							<Table.Head>Message</Table.Head>
							<Table.Head>Site Status</Table.Head>
							<Table.Head>Webhook Status</Table.Head>
							<Table.Head>Error</Table.Head>
							<Table.Head>Triggered at</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each alertLogs as { message, sent, websiteStatus, webhookStatus, createdAt, error }}
							<Table.Row>
								<Table.Cell class="flex w-12 justify-center">
									{#if sent}
										<div class="flex size-4 items-center justify-center rounded-full bg-green-500">
											<Check class="size-3 text-white" />
										</div>
									{:else}
										<div class="flex size-4 items-center justify-center rounded-full bg-red-500">
											<X class="size-3 text-white" />
										</div>
									{/if}
								</Table.Cell>
								<Table.Cell>{message}</Table.Cell>
								<Table.Cell>
									<StatusBadge status={websiteStatus} />
								</Table.Cell>
								<Table.Cell>
									{webhookStatus}
								</Table.Cell>
								<Table.Cell>
									{#if error}
										<code class="rounded-sm bg-sidebar px-2 py-1">{error}</code>
									{/if}
								</Table.Cell>
								<Table.Cell class="w-60">{prettifyDate(new Date(createdAt))}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			{:else}
				<p class="p-6 text-center">No alert logs found for the last 7 days.</p>
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

	<Dialog.Root bind:open={showAlertFormDialog}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>{alert ? 'Update' : 'Add'} Alert</Dialog.Title>
				<Dialog.Description>
					{alert ? 'Update the details of this alert.' : 'Enter the details for a new alert.'}
				</Dialog.Description>
			</Dialog.Header>
			<SiteAlertForm bind:showAlertFormDialog bind:alert bind:websiteId={data.website.id} />
		</Dialog.Content>
	</Dialog.Root>

	<Dialog.Root bind:open={showDeleteAlertDialog}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Delete Message</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to delete this alert? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<SiteAlertDelete bind:showDeleteAlertDialog bind:alert />
		</Dialog.Content>
	</Dialog.Root>
{/if}
