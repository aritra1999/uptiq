<script lang="ts">
	import Logo from '$lib/components/ui/logo/logo.svelte';
	import Auth from '$lib/components/ui/auth/auth.svelte';
</script>

<nav class="flex h-20 w-screen place-items-center text-lg font-medium">
	<div class="container mx-auto flex items-center justify-between">
		<a href="/">
			<Logo />
		</a>
		<Auth />
	</div>
</nav>
