<script>
	import { wpFeedUrl, user } from '$/stores';
</script>

<select bind:value={$wpFeedUrl}>
	{#each $user.urls || [] as url}
		<option value={url}>
			{url}
		</option>
	{/each}
</select>
