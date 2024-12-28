<script lang="ts">
	import { messageStore, selectedMessageStore } from '$lib/store/message.store';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils';

	let { websiteId, showMessageFormDialog = $bindable() } = $props();
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	let selectedMessage = $selectedMessageStore
		? $messageStore.get($selectedMessageStore)
		: undefined;
	let title = $state(selectedMessage ? selectedMessage.title : '');
	let content = $state(selectedMessage ? selectedMessage.content : '');
	let startDate = $state<DateValue>(
		selectedMessage
			? parseDate(new Date(selectedMessage.startTime).toISOString().split('T')[0])
			: parseDate(new Date().toISOString().split('T')[0])
	);
	let startTime = $state(
		selectedMessage
			? selectedMessage.startTime.split(' ')[1].substring(0, 5) // Gets "11:00" from "11:00:00+00"
			: new Date().toLocaleTimeString('en-US', {
					hour12: false,
					hour: '2-digit',
					minute: '2-digit'
				})
	);
	let formError = $state('');
	let loading = $state(false);

	const handleSubmit = async (event: Event): Promise<void> => {
		event.preventDefault();
		loading = true;

		const url = selectedMessage
			? `/api/messages/${websiteId}/${selectedMessage.id}`
			: `/api/messages/${websiteId}`;
		const body = {
			title,
			content,
			startTime: new Date(`${startDate} ${startTime}`),
			id: selectedMessage?.id
		};

		await fetch(url, {
			method: selectedMessage ? 'PUT' : 'POST',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					formError = data.error;
					return;
				} else {
					messageStore.update((messageMap) => {
						messageMap.set(String(data.id), data);
						return messageMap;
					});
				}
				showMessageFormDialog = false;
			})
			.catch((err) => {
				console.log(err);
				formError = 'An error occurred. Please try again later.';
			});

		loading = false;
	};
</script>

<form onsubmit={handleSubmit} class="mt-4 space-y-4">
	{#if formError}
		<div class="mb-4 text-left">
			<div class="flex items-center border border-red-400 px-4 py-2 text-red-400">
				<CircleAlert class="mr-2 h-4 w-4" />
				{formError}
			</div>
		</div>
	{/if}

	<Input label="Title" id="title" bind:value={title} required />
	<div class="flex items-center space-x-4">
		<div class="w-3/5">
			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							variant="outline"
							class={cn(
								'h-full w-full justify-between rounded-lg border border-input bg-transparent px-4 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
								!startDate && 'text-muted-foreground'
							)}
							{...props}
						>
							<div class="text-left">
								<div class="text-xs font-semibold text-muted-foreground">
									Select a date
									<span class="text-red-500"> * </span>
								</div>
								{startDate ? df.format(startDate.toDate(getLocalTimeZone())) : 'Select a date'}
							</div>
							<div>
								<CalendarIcon class="mr-2 size-4" />
							</div>
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0">
					<Calendar bind:value={startDate} type="single" initialFocus />
				</Popover.Content>
			</Popover.Root>
		</div>
		<div class="w-2/5">
			<Input
				label="Time"
				id="startTime"
				type="time"
				name="startTime"
				bind:value={startTime}
				required
			/>
		</div>
	</div>
	<Textarea
		label="Content"
		id="content"
		bind:value={content}
		data-gramm_editor="false"
		class="resize-none"
		required
	/>
	<Button type="submit" disabled={loading}>
		Submit
		{#if loading}
			<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
		{/if}
	</Button>
</form>
