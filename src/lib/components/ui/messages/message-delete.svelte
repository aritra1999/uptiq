<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { messageStore, selectedMessageStore } from '$lib/store/message.store';

	let { showDeleteMessageDialog = $bindable() } = $props();
	let loading = $state(false);
	let selectedMessage = $messageStore.get($selectedMessageStore ?? '');

	const deleteMessage = async () => {
		if (!selectedMessage) return;

		loading = true;
		await fetch(`/api/messages/${selectedMessage.id}`, { method: 'DELETE' }).then(() => {
			showDeleteMessageDialog = false;

			messageStore.update((messageMap) => {
				messageMap.delete(selectedMessage.id);
				return messageMap;
			});
		});

		loading = false;
	};
</script>

{#if selectedMessage}
	<div>
		<div class="mb-4">
			Delete - {selectedMessage.title} ?
		</div>
		<Button variant="destructive" onclick={deleteMessage}>
			Confirm
			{#if loading}
				<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
			{/if}
		</Button>
	</div>
{/if}
