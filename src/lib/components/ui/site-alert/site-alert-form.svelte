<script lang="ts">
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';

	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';

	let {
		showAlertFormDialog = $bindable(),
		websiteId = $bindable(),
		alert = $bindable()
	} = $props();
	let loading = $state(false);
	let formError: string = $state('');

	let type = $state(alert ? alert.type : 'webhook');
	let target = $state(alert ? alert.target : '');
	let enabled = $state(alert ? alert.enabled : true);

	const handleSubmit = async (event: Event): Promise<void> => {
		event.preventDefault();
		loading = true;

		const URL = alert ? `/api/alerts/${alert.id}` : `/api/alerts/${websiteId}`;
		const alertData = { type, target, enabled };

		await fetch(URL, {
			method: alert ? 'PUT' : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(alertData)
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data.error) {
					formError = data.error;
					return;
				} else {
					alert = data;
				}
				showAlertFormDialog = false;
			})
			.catch((err) => {
				console.log(err);
				formError = 'An error occurred. Please try again later.';
			});

		loading = false;
	};
</script>

<form onsubmit={handleSubmit} class="my-4 space-y-4">
	{#if formError}
		<div class="mb-4 text-left">
			<div class="flex items-center border border-red-400 px-4 py-2 text-red-400">
				<CircleAlert class="mr-2 h-4 w-4" />
				{formError}
			</div>
		</div>
	{/if}

	<Select type="single" bind:value={type}>
		<SelectTrigger class="capitalize" label="Alert Type"
			>{type ? type : 'Select alert type'}</SelectTrigger
		>
		<SelectContent>
			<SelectItem value="webhook">Webhook</SelectItem>
			<SelectItem value="email" disabled>Email (soming soon)</SelectItem>
			<SelectItem value="slack" disabled>Slack (coming soon)</SelectItem>
		</SelectContent>
	</Select>

	<Input
		label="Target"
		id="target"
		bind:value={target}
		placeholder={type === 'email' ? 'Email address' : 'Webhook URL'}
		type={type === 'email' ? 'email' : 'url'}
		required
	/>
	<div class="flex items-center justify-between">
		<Button type="submit" disabled={loading}>
			Submit
			{#if loading}
				<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
			{/if}
		</Button>
		<div class="flex items-center space-x-2">
			<Checkbox id="enabled" bind:checked={enabled} aria-labelledby="terms-label" />
			<Label
				id="terms-label"
				for="terms"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				Enabled
			</Label>
		</div>
	</div>
</form>
