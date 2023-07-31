<script>
	import { onMount } from 'svelte';
	import localforage from 'localforage';
	import './styles.css';

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

<background>
	<div class="header-background" />
	<div class="main-background" />
</background>

<style>
	background {
		position: absolute;
		top: 0;
		height: 100%;
		width: 100%;
		z-index: -1;
	}
	.header-background {
		position: absolute;
		top: 0;
		height: 100px;
		width: 100%;
		background-color: var(--color-bg-2);
		background-image: linear-gradient(
			180deg,
			var(--color-bg-0) 0%,
			var(--color-bg-1) 40%,
			var(--color-bg-2) 100%
		);
		z-index: -1;
	}

	.footer-background {
		position: absolute;
		bottom: 0;
		height: 60px;
		width: 100%;
		background-color: var(--color-bg-2);
		background-image: linear-gradient(
			180deg,
			var(--color-bg-2) 0%,
			var(--color-bg-0) 10%,
			var(--color-bg-1) 100%
		);
		z-index: -1;
	}

	.main-background {
		background-attachment: fixed;
		background-color: var(--color-bg-2);
		z-index: -2;
		position: absolute;
		height: 100%;
		width: 100%;
	}

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
