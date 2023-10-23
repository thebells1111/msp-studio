<script>
	import { onMount } from 'svelte';
	import getFeeds from '$routes/functions/getFeeds.js';
	import Editor from './Editor.svelte';

	import { feeds } from '$/stores';

	let isLoading = true;

	onMount(async () => {
		getFeeds().then((data) => {
			$feeds = JSON.parse(data);
		});

		setTimeout(() => {
			isLoading = false;
		}, 2000);
	});
</script>

{#if isLoading}
	<div class="record-container">
		<img src="/msp-record-300.png" alt="Record" class="record" />
	</div>
{:else}
	<Editor />
{/if}

<style>
	.record-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		height: 100vh;
		width: 100vw;
		top: 0;
	}

	.record {
		height: 300px;
		width: 300px;
		animation: spin 2s infinite linear;
		border-radius: 50%;
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
