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
	let showAddNewButton = true;
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

{#if showAddNewButton && add}
	<button on:click={() => (showAddNewButton = false)}>Add New Album</button>
{:else}
	<div>
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
	</div>
{/if}

<style>
	div {
		display: flex;
		align-items: flex-end;
		margin: 4px 0 8px 16px;
	}

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
</style>
