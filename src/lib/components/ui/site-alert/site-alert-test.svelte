<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import FlaskConical from 'lucide-svelte/icons/flask-conical';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { toast } from 'svelte-sonner';

	let { websiteId = $bindable(), alertLogs = $bindable() } = $props();
	let loading = $state(false);

	const triggerTestAlert = async () => {
		loading = true;
		await fetch(`/api/alerts/test/${websiteId}`)
			.then((res) => res.json())
			.then((res) => {
				if (res.alertLog) {
					alertLogs.unshift(res.alertLog);
					toast.success('Webhook triggered successfully!', res.alertLog.message);
				} else {
					toast.warning(res.error);
				}
			})
			.catch((err) => {
				toast.error(err.message);
			});
		loading = false;
	};
</script>

<Button variant="secondary" class="w-full" onclick={triggerTestAlert} disabled={loading}>
	{#if loading}
		<LoaderCircle class="mr-2 size-5 animate-spin" />
	{:else}
		Test
		<FlaskConical class="ml-2 size-4" />
	{/if}
</Button>
