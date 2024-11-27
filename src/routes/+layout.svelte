<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher defaultMode={'dark'} />
{@render children()}
