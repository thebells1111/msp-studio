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

<band-modal
	on:click|self={() => {
		showEdit = false;
	}}
>
	<div>
		<label class="band-name">
			<p>Band Name</p>
			<input bind:value={newBandName} placeholder="band name" />
		</label>

		<button on:click={() => (add ? addNewBand() : saveBand())}>
			{add ? 'Add Band' : 'Save Band'}
		</button>
		{#if !add}
			<button on:click={deleteItem.bind(this, $selectedBand.title, deleteBand)} class="delete">
				Delete
			</button>
		{/if}
	</div>
</band-modal>

<style>
	div {
		display: flex;
		align-items: flex-end;
		margin: 4px 0 8px 16px;
	}

	label {
		padding: 0 1em 0 0;
	}

	.band-name {
		flex-grow: 1;
	}

	.band-name input {
		width: 100%;
	}

	p {
		padding: 0;
		margin: 0;
	}
	button.delete {
		margin-right: 158px;
	}

	band-modal {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: absolute;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 3;
	}

	band-modal div {
		width: calc(100% - 100px);
		height: calc(100% - 100px);
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: black;
		border-radius: 8px;
	}
</style>
