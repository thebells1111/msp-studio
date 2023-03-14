<script>
	import { slide } from 'svelte/transition';
	import ChangeBand from './ChangeBand.svelte';
	import AlbumInput from '../Inputs/AlbumInput.svelte';
	import Add from '../icons/Add.svelte';
	import Delete from '../icons/Delete.svelte';
	import deleteItem from '../functions/deleteItem';

	import {
		selectedBand,
		selectedBandIndex,
		selectedAlbum,
		selectedAlbumIndex,
		selectedTrack,
		selectedTrackIndex,
		newTrack,
		catalogDB,
		selectedScreen,
		MSPValue
	} from '$/stores';

	let showEdit = false;

	async function selectAlbum(album, index) {
		$selectedAlbum = album;
		$selectedAlbumIndex = index;
		$selectedTrack = $newTrack;
		$selectedTrackIndex = -1;
		$selectedScreen = 'tracks';
	}

	async function deleteAlbum(index) {
		$selectedBand.albums.splice(index, 1);
		$selectedBand = $selectedBand;
		$selectedAlbumIndex = -1;
		$selectedTrackIndex = -1;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}

	async function addNewAlbum() {
		let album = {};
		album.title = '';
		album.artwork = '';
		album.tracks = [];
		album.value = [$MSPValue];
		album.decription = '';
		album.explicit = 'no';
		$selectedAlbum = album;
		$selectedBand.albums = $selectedBand.albums.concat($selectedAlbum);
		$selectedAlbumIndex = $selectedBand.albums.length - 1;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}
</script>

<ChangeBand />
<header>
	<h3>Select an Album</h3>
	<button
		on:click={() => {
			addNewAlbum();
			showEdit = true;
		}}
	>
		<Add size="30" />
	</button>
</header>
<ul>
	{#each $selectedBand?.albums || [] as album, i}
		<li>
			<button
				on:click={deleteItem.bind(this, album.title || 'Blank Album', deleteAlbum.bind(this, i))}
				class="delete"
			>
				<Delete size="18" />
			</button>
			<p on:click={selectAlbum.bind(this, album, i)}>{album.title || 'Blank Album'}</p>
		</li>
	{/each}
</ul>

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<AlbumInput bind:showEdit />
	</div>
{/if}

<style>
	header {
		display: flex;
		align-items: center;
	}
	ul {
		padding: 0 0 0 16px;
		margin: 0;
	}

	h3 {
		margin: 8px 0;
	}
	button {
		color: var(--color-bg-add-band);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 8px;
	}

	li {
		list-style: none;
		padding: 4px 0;
		display: flex;
	}

	p {
		margin: 0 8px;
		padding: 0;
	}

	button.delete {
		color: var(--color-bg-delete);
	}
</style>
