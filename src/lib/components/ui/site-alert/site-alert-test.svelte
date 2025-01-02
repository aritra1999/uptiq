<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import FlaskConical from 'lucide-svelte/icons/flask-conical';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let { websiteId = $bindable() } = $props();
	let loading = $state(false);

	const triggerTestAlert = async () => {
		loading = true;
		await fetch(`/api/alerts/test/${websiteId}`);
		loading = false;
	};
</script>

<Button variant="outline" class="w-28" onclick={triggerTestAlert}>
	{#if loading}
		<LoaderCircle class="mr-2 size-5 animate-spin" />
	{:else}
		Test
		<FlaskConical class="ml-2 size-4" />
	{/if}
</Button>
