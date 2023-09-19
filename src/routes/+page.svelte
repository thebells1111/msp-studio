<script>
	import { onMount } from 'svelte';
	import localforage from 'localforage';
	import Editor from './Editor.svelte';

	import { catalogDB, library, user, wpFeedUrl } from '$/stores';

	let isLoading = true;

	onMount(() => {
		// fetch('/api/alby/refresh')
		// 	.then((res) => {
		// 		return res.json();
		// 	})
		// 	.then((data) => {
		// 		$user.loggedIn = data.loggedIn;
		// 		$user.name = data.name;
		// 	});

		$catalogDB = localforage.createInstance({
			name: 'catalogDB'
		});

		$catalogDB
			.keys()
			.then(async function (keys) {
				let _catalog = keys.map((v) => $catalogDB.getItem(v));
				$library = await Promise.all(_catalog);
				$library = $library;
				console.log($library);
				setTimeout(() => {
					isLoading = false;
				}, 2000);
			})
			.catch(function (err) {
				console.log(err);
			});
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
		position: absolute;
		height: 100%;
		width: 100%;
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
