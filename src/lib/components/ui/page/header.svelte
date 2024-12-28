<script lang="ts">
	let { title, description = null } = $props();
</script>

<div class="my-8">
	{#if title}
		<h1 class="mb-2 text-3xl font-semibold">{title}</h1>
		{#if description}<p>{description}</p>{/if}
	{/if}
</div>
