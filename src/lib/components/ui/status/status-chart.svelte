<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Chart, registerables } from 'chart.js';
	import { prettifyDate } from '$lib/utils';
	import { statusColorMap } from '$lib/components/ui/status/constants';
	import type { SelectPartialStatus } from '$lib/db/schema';

	interface Props {
		statuses: SelectPartialStatus[];
	}

	let { statuses }: Props = $props();

	Chart.register(...registerables);
	let barChartElement: HTMLCanvasElement = $state();
	const chartData = {
		labels: statuses.map(({ createdAt }) => createdAt),
		datasets: [
			{
				label: 'Response Time (ms)',
				labels: statuses.map(({ statusCode }) => `Status Code: ${statusCode}`),
				data: statuses.map(({ responseTime }) => responseTime),
				backgroundColor: statuses.map((status) => statusColorMap[status.status])
			}
		]
	};

	onMount(() => {
		if (browser) {
			new Chart(barChartElement, {
				type: 'bar',
				data: chartData,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
						tooltip: {
							callbacks: {
								label: function (context) {
									let label = context.dataset.labels[context.dataIndex] || '';
									if (label) {
										label += ': ';
									}
									label += context.formattedValue;
									return label;
								}
							}
						}
					},
					scales: {
						x: {
							ticks: { display: false },
							grid: { color: 'transparent' }
						},
						y: {
							grid: { color: '#f5f5f5' },
							beginAtZero: true
						}
					}
				}
			});
		}
	});
</script>

<div class="h-32">
	<canvas bind:this={barChartElement}></canvas>
</div>
<div class="mt-1 flex items-center justify-between text-xs text-muted-foreground">
	{#if statuses.length > 0}
		<div class="flex w-full items-center justify-between text-xs">
			<div>{prettifyDate(new Date(statuses[0].createdAt))}</div>
			{#if statuses.length > 2}
				<div>
					{prettifyDate(new Date(statuses[Math.floor((statuses.length - 1) / 2)].createdAt))}
				</div>
			{/if}
			<div>{prettifyDate(new Date(statuses[statuses.length - 1].createdAt))}</div>
		</div>
	{:else}
		<div class="text-center text-xs text-muted-foreground">No status history available</div>
	{/if}
</div>
