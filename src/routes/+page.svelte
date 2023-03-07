<script>
	import { onMount } from 'svelte';
	import localforage from 'localforage';
	import './styles.css';

	import Editor from './Editor.svelte';
	import FileUploader from './FileUploader.svelte';
	import FileForm from './FileForm.svelte';

	import { catalogDB, library } from '$/stores';

	$: console.log($library);

	onMount(() => {
		$catalogDB = localforage.createInstance({
			name: 'catalogDB'
		});

		$catalogDB
			.keys()
			.then(async function (keys) {
				// An array of all the key names.
				console.log(keys);
				let _catalog = keys.map((v) => $catalogDB.getItem(v));
				$library = await Promise.all(_catalog);
				$library = $library;
			})
			.catch(function (err) {
				// This code runs if there were any errors
				console.log(err);
			});
	});
</script>

<Editor />
<!-- <FileUploader /> -->
<!-- <FileForm /> -->

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
</style>
