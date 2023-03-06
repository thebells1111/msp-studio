<script>
	import deleteItem from '../functions/deleteItem';

	import { onMount } from 'svelte';

	import {
		library,
		selectedBand,
		selectedBandIndex,
		newBand,
		selectedAlbum,
		selectedAlbumIndex,
		newAlbum,
		selectedTrack,
		selectedTrackIndex,
		newTrack,
		catalogDB,
		selectedScreen
	} from '$/stores';

	export let add = false;
	export let showEdit = false;
	let showAddNewButton = true;
	let newBandName = '';
	let newBandImage = '';

	onMount(() => {
		newBandName = $selectedBand.title || '';
		newBandImage = $selectedBand.artwork || '';
	});

	async function addNewBand() {
		let band = {};
		console.log(newBandName);
		band.title = newBandName;
		band.artwork = newBandImage;
		band.albums = [];
		$library = $library.concat(band);
		$selectedBandIndex = $library.length - 1;
		$catalogDB.setItem(band.title, band);
		console.log(band);
		$selectedBand = band;
		$selectedAlbum = $newAlbum;
		$selectedAlbumIndex = -1;
		$selectedTrack = $newTrack;
		$selectedTrackIndex = -1;
		$selectedScreen = 'albums';
		showAddNewButton = true;
	}

	async function saveBand() {
		$selectedBand.title = newBandName;
		$selectedBand.artwork = newBandImage;
		$library[$selectedBandIndex] = $selectedBand;
		$library = $library.concat($selectedBand);
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'albums';
		showEdit = false;
	}

	async function deleteBand() {
		console.log($selectedBandIndex);
		$library.splice($selectedBandIndex, 1);
		$library = $library;
		$selectedBandIndex = -1;
		$selectedAlbumIndex = -1;
		$selectedTrackIndex = -1;
		$catalogDB.removeItem($selectedBand.title);
		$selectedBand = $newBand;
		$selectedAlbum = $newAlbum;
		$selectedScreen = 'bands';
		showEdit = false;
	}
</script>

{#if showAddNewButton && add}
	<button on:click={() => (showAddNewButton = false)}>Add New Band</button>
{:else}
	<div>
		<label>
			<p>Band Name</p>
			<input bind:value={newBandName} placeholder="band name" />
		</label>

		<button on:click={() => (add ? addNewBand() : saveBand())}>
			{add ? 'Add Band' : 'Save Band'}
		</button>
		{#if !add}
			<button on:click={deleteItem.bind(this, $selectedBand.title, deleteBand)}> Delete </button>
		{/if}
	</div>
{/if}

<style>
	div {
		display: flex;
		align-items: flex-end;
		margin: 1em 0 0 0;
	}

	label {
		padding: 0 1em 0 0;
	}

	p {
		padding: 0;
		margin: 0;
	}
</style>
