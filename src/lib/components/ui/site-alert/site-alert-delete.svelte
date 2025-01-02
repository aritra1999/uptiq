<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let { alert = $bindable(), showDeleteAlertDialog = $bindable() } = $props();

	let loading = $state(false);

	const deleteAlert = async () => {
		if (!alert) return;
		loading = true;
		await fetch(`/api/alerts/${alert.id}`, { method: 'DELETE' }).then(() => {
			showDeleteAlertDialog = false;
			alert = null;
		});
		loading = false;
	};
</script>

{#if alert}
	<div>
		<div class="mb-4">
			Delete alert ?

			<div class="my-6 rounded-lg bg-sidebar px-4 py-2">
				<code class="h-fit text-sm">{alert.target}</code>
			</div>
		</div>
		<Button variant="destructive" onclick={deleteAlert}>
			Confirm
			{#if loading}
				<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
			{/if}
		</Button>
	</div>
{/if}
