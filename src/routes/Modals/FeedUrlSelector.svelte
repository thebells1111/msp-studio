<script>
	import Select from 'svelte-select';
	import { wpFeedUrl, user } from '$/stores';

	function handleChange(e) {
		$wpFeedUrl = e.detail.value || '';
	}
</script>

<div>
	<Select
		on:change={handleChange}
		items={$user.urls || []}
		placeholder="select a WordPress site for upload"
		--border-radius="4px"
		--placeholder-color="var(--color-input-text-0)"
		--input-color="var(--color-input-text-0)"
		--background="var(--color-input-bg-0)"
		--clear-select-focus-outline="0"
		--input-padding="4px"
		--selected-item-padding="0 4px"
		--border="1px solid transparent"
		--list-background="var(--color-bg-1)"
		--item-hover-bg="var(--color-bg-0)"
		--padding="0"
		--height="30px"
		--border-hover="1px solid var(--color-bg-select-track)"
		--border-focused="1px solid #66afe9"
	/>
</div>

<style>
	div {
		width: 50%;
		min-width: 320px;
		margin: 64px auto;
	}
</style>
