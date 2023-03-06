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
