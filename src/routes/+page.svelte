<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import Logo from '$lib/components/ui/logo/logo.svelte';
	import InteractiveHover from '$lib/components/ui/landing/InteractiveHover.svelte';
	import PricingCard from '$lib/components/ui/landing/PricingCard.svelte';
	import SparklesText from '$lib/components/ui/sparkels/SparklesText.svelte';
	import BentoGrid from '$lib/components/ui/bento/BentoGrid.svelte';
	import BentoGridItem from '$lib/components/ui/bento/BentoGridItem.svelte';
	import DynamicImage from '$lib/components/ui/landing/DynamicImage.svelte';
	import StatusCard from '$lib/components/ui/status/status-card.svelte';
	import { websiteStore } from '$lib/store/website.store';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import Globe from 'lucide-svelte/icons/globe';
	import Bell from 'lucide-svelte/icons/bell';
	import Globe2 from 'lucide-svelte/icons/globe-2';
	import MessageSquareDot from 'lucide-svelte/icons/message-square-dot';

	let { data } = $props();
	let thumbnail = {
		title: 'Public Status Page',
		description: 'Public status page for your website',
		dark: 'https://ucarecdn.com/99449e24-a558-4d09-a1df-9d9beb7beb9b/-/preview/1000x669/',
		light: 'https://ucarecdn.com/88c05e00-84d1-4d37-9352-38afe16f1208/-/preview/1000x670/'
	};
	let siteDetails = {
		title: 'Website Monitoring',
		description: 'Monitor your website uptime and performance',
		dark: 'https://ucarecdn.com/a966f0f4-3059-43e9-a0f6-c916146406ab/-/preview/1000x700/',
		light: 'https://ucarecdn.com/7b1fbeca-e19c-4339-b188-498774f2c9fd/-/preview/1000x700/'
	};

	const plans = {
		free: {
			name: 'Free',
			price: 0,
			features: [
				'Up to 2 projects',
				'Up to 2 monitors per project',
				'Webhook alerts',
				'1 location monitoring',
				'Public status page'
			]
		},
		pro: {
			name: 'Pro',
			price: 2,
			features: [
				'Unlimited projects',
				'Unlimited monitors',
				'Webhook alerts (Email coming soon)',
				'Slack integration (coming soon)',
				'Global monitoring',
				'Public status page'
			]
		}
	};

	const features = [
		{
			icon: Globe,
			description:
				'Share your uptime status with your users through a beautiful, customizable public status page.',
			feature: 'Public status page'
		},
		{
			icon: Bell,
			description:
				'Get instant notifications through webhooks when your website goes down or comes back up.',
			feature: 'Webhook alerts'
		},
		{
			icon: Globe2,
			description:
				'Monitor your website from multiple locations around the world for comprehensive coverage.',
			feature: 'Global monitoring'
		},
		{
			icon: MessageSquareDot,
			description:
				'Post messages to your status page to keep your users informed about downtime or updates.',
			feature: 'Messages / Updates'
		}
	];

	onMount(() => {
		const websiteMap = new Map();
		websiteMap.set(data.website.id, data.website);
		websiteStore.set(websiteMap);
	});

	onDestroy(() => {
		websiteStore.set(new Map());
	});
</script>

<main class="container mx-auto py-4">
	<nav
		class="mb-4 flex w-full items-center justify-between rounded-xl bg-muted px-4 py-2 dark:bg-sidebar"
	>
		<Logo />
		<div>
			<a href={$page.data.session ? '/projects' : '/auth/signin'}>
				<InteractiveHover text={$page.data.session ? 'Go to dashboard' : 'Try it out!'} />
			</a>
		</div>
	</nav>
	<BentoGrid className="mb-4">
		<BentoGridItem className="col-span-1 sm:col-span-2 lg:col-span-1 sm:row-span-1 p-8">
			<div class="w-full">
				<p class="text-xl sm:text-2xl">Babe wake up,</p>
				<SparklesText text="Uptime Monitoring" />
				<p class="mb-6 text-xl sm:text-2xl">just got easier!</p>
			</div>
			<div>
				<a href={$page.data.session ? '/projects' : '/auth/signin'}>
					<InteractiveHover text={$page.data.session ? 'Go to dashboard' : 'Try it out!'} />
				</a>
			</div>
		</BentoGridItem>
		<BentoGridItem className="col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 p-2">
			<DynamicImage images={thumbnail} />
		</BentoGridItem>
		<BentoGridItem className="col-span-1 p-2">
			<div>
				{#if data.website && data.statuses.length > 0}
					<StatusCard
						classProps="hover:border-0 border-0"
						websiteId={data.website.id}
						demoStatuses={data.statuses}
						showSettings={false}
						showWebsiteFormDialog={false}
						showDeleteWebsiteDialog={false}
					/>
				{/if}
			</div>
		</BentoGridItem>
		<BentoGridItem className="col-span-1 row-span-2 sm:row-span-1 sm:col-span-2 p-2">
			<div class="flex h-full flex-col gap-2 sm:flex-row">
				<PricingCard plan={plans['free']} />
				<PricingCard plan={plans['pro']} />
			</div>
		</BentoGridItem>
		<BentoGridItem className="col-span-1 row-span-2 p-2">
			<div class="flex h-full flex-col justify-evenly gap-2">
				{#each features as { icon: Icon, feature, description }}
					<div class=" h-full rounded-lg bg-background p-6">
						<h2 class="mb-6 flex items-center gap-6 text-xl font-semibold">
							<Icon class="size-5" />
							{feature}
						</h2>
						<p class="text-sm text-muted-foreground">{description}</p>
					</div>
				{/each}
			</div>
		</BentoGridItem>
		<BentoGridItem className="col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 p-2">
			<DynamicImage images={siteDetails} />
		</BentoGridItem>
		<BentoGridItem className="col-span-1 p-2">
			<div class="relative h-full w-full">
				<div class="absolute bottom-4 right-4 rounded-md bg-lime-300 px-4 py-2 text-neutral-900">
					Work In Progress 🚧
				</div>
				<img
					src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbW83c2F3dzFuMDF5bGwwNGF3amViMngyMDVsd2pjY2d4cHh3MWtraCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ZTans30ONaaIM/giphy.gif"
					class=" h-full w-full rounded-lg object-cover"
					alt=""
				/>
			</div>
		</BentoGridItem>
	</BentoGrid>
	<div
		class="flex w-full items-center justify-between rounded-xl bg-muted px-4 py-2 dark:bg-sidebar"
	>
		<Logo />
		<div class="flex items-center gap-8 text-sm text-muted-foreground">
			<p>&copy; 2024 Uptiq. All rights reserved.</p>
		</div>
		<Button onclick={toggleMode} variant="ghost" size="icon">
			<Sun class="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0" />
			<Moon class="absolute h-[1.2rem] w-[1.2rem]  scale-0 dark:scale-100" />
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</main>
