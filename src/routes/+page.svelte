<script lang="ts">
	import { page } from '$app/stores';
	import { SignIn } from '@auth/sveltekit/components';
</script>

<div class="px-6">
	{#if $page.data.session}
		<a href="/projects">Projects</a>
	{:else}
		<SignIn options={{ redirectTo: '/projects' }} signInPage="signin" />
	{/if}
</div>
