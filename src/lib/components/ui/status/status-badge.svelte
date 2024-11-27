<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { statusColorMap } from '$lib/components/ui/status/constants';

	let { status } = $props();
</script>

<Badge
	variant="outline"
	class="border-none bg-opacity-20 px-3 py-1 font-medium"
	style="background: {statusColorMap[status] + '30'};"
>
	<div class="mr-2 h-2 w-2 rounded-full" style="background: {statusColorMap[status]};"></div>
	{status.toUpperCase()}
</Badge>
