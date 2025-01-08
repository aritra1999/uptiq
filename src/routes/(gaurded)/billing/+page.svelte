<script lang="ts">
	import Sparkles from 'lucide-svelte/icons/sparkles';
	import Header from '$lib/components/ui/page/header.svelte';
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { toast } from 'svelte-sonner';
	import { PUBLIC_STRIPE_PAYMENT_LINK } from '$env/static/public';

	let { data } = $props();
	let loading = $state(false);

	const handleCancel = async () => {
		loading = true;
		await fetch('/api/billing/cancel')
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				loading = false;
				if (data.error) {
					toast.error(data.error);
					return;
				}
				location.reload();
			})
			.catch((err) => {
				loading = false;
				console.log(err);
				toast.error('An error occurred. Please try again later.');
			});
	};
</script>

<section class="mx-auto max-w-4xl">
	<Header title="Billing" />

	<div class="mt-8">
		<div class="grid gap-6">
			<div class="flex items-center justify-between">
				<h2 class="text-2xl font-semibold">Account Details</h2>
				{#if data.user.pro}
					<div
						class="flex items-center gap-2 rounded-lg bg-lime-300 px-4 py-1 font-semibold text-neutral-900"
					>
						<Sparkles class="size-4" />
						Pro Account
					</div>
				{:else}
					<div
						class="flex items-center gap-2 rounded-lg bg-lime-100 px-4 py-1 font-semibold text-neutral-900"
					>
						Free Account
					</div>
				{/if}
			</div>
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="name" class="text-sm text-gray-500">Full Name</label>
						<p class="font-medium">{data.user.name}</p>
					</div>
					<div>
						<label for="username" class="text-sm text-gray-500">Username</label>
						<p class="font-medium">@{data.user.username}</p>
					</div>
				</div>

				<div>
					<label for="email" class="text-sm text-gray-500">Email</label>
					<p class="font-medium">{data.user.email}</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="createdAt" class="text-sm text-gray-500">Member Since</label>
						<p class="font-medium">{new Date(data.user.createdAt).toLocaleDateString()}</p>
					</div>
					<div>
						<label for="updatedAt" class="text-sm text-gray-500">Last Updated</label>
						<p class="font-medium">{new Date(data.user.updatedAt).toLocaleDateString()}</p>
					</div>
				</div>
			</div>
			<div class="mt-4">
				{#if data.user.pro}
					<Button onclick={handleCancel} size="lg" variant="destructive">
						Cancel Pro Subscription
						{#if loading}
							<LoaderCircle class="ml-2 h-5 w-5 animate-spin" />
						{/if}
					</Button>
				{:else}
					<Button
						target="_blank"
						href={`${PUBLIC_STRIPE_PAYMENT_LINK}?prefilled_email=${data.user.email}&prefilled_name=${data.user.name}`}
						size="lg"
					>
						<Sparkles class="size-4" />
						Upgrade to Pro
					</Button>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	label {
		display: block;
		margin-bottom: 0.25rem;
	}
</style>
