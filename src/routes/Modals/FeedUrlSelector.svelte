<script>
	import { wpFeedUrl, user } from '$/stores';
</script>

<h4>Select your WordPress Link</h4>

<select bind:value={$wpFeedUrl}>
	<option disabled selected value> -- select an option -- </option>
	{#each $user.urls || [] as url}
		<option value={url}>
			{url}
		</option>
	{/each}
</select>
