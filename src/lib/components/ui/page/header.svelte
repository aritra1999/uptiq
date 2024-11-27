<script lang="ts">
	let { title } = $props();
</script>

{#if title}
	<h1 class="my-8 text-3xl font-semibold">{title}</h1>
{/if}
