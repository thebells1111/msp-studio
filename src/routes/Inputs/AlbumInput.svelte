<script>
	import deleteItem from '../functions/deleteItem';
	import {
		library,
		selectedBand,
		selectedAlbum,
		selectedAlbumIndex,
		catalogDB,
		selectedScreen
	} from '$/stores';

	import { onMount } from 'svelte';

	export let add = false;
	export let showEdit = false;
	let newAlbumName = '';
	let newAlbumImage = '';

	onMount(() => {
		console.log($selectedAlbum);
		newAlbumName = $selectedAlbum.title || '';
		newAlbumImage = $selectedAlbum.artwork || '';
	});

	async function addNewAlbum() {
		let album = {};
		album.title = newAlbumName;
		album.artwork = newAlbumImage;
		album.tracks = [];
		$selectedAlbum = album;
		$selectedBand.albums = $selectedBand.albums.concat($selectedAlbum);
		$selectedAlbumIndex = $selectedBand.albums.length - 1;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'tracks';
		showAddNewButton = true;
	}

	async function saveAlbum() {
		$selectedAlbum.title = newAlbumName;
		$selectedAlbum.artwork = newAlbumImage;
		$selectedBand.albums[$selectedAlbumIndex] = $selectedAlbum;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'tracks';
		showEdit = false;
	}
</script>

<blurred-background
	on:click|self={() => {
		showEdit = false;
	}}
>
	<album-modal>
		<label>
			<p>Album Name (required)</p>
			<input bind:value={newAlbumName} />
		</label>
		<label>
			<p>Link to Album Image (required)</p>
			<input bind:value={newAlbumImage} />
		</label>
		<button on:click={() => (add ? addNewAlbum() : saveAlbum())}>
			{add ? 'Add Album' : 'Save Album'}
		</button>
		{#if !add}
			<button on:click={deleteItem.bind(this, $selectedBand.title, deleteBand)} class="delete">
				Delete
			</button>
		{/if}
	</album-modal>
</blurred-background>

<style>
	label {
		padding: 0 1em 0 0;
		flex-grow: 1;
	}

	input {
		width: 100%;
	}

	p {
		padding: 0;
		margin: 0;
	}
	button.delete {
		margin-right: 158px;
	}

	blurred-background {
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

	album-modal {
		width: calc(100% - 100px);
		height: calc(100% - 100px);
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: black;
		border-radius: 8px;
	}
</style>
