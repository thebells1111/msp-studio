<script>
	import { slide } from 'svelte/transition';
	import EditBand from '../EditHeaders/EditBand.svelte';
	import AlbumInput from '../Inputs/AlbumInput.svelte';

	import {
		selectedBand,
		selectedAlbum,
		selectedAlbumIndex,
		selectedTrack,
		selectedTrackIndex,
		newTrack,
		selectedScreen
	} from '$/stores';

	let showEdit = false;

	async function selectAlbum(album, index) {
		$selectedAlbum = album;
		$selectedAlbumIndex = index;
		$selectedTrack = $newTrack;
		$selectedTrackIndex = -1;
		$selectedScreen = 'tracks';
	}
</script>

<EditBand />
<h4>Select an Album</h4>
<ul>
	{#each $selectedBand?.albums || [] as album, i}
		<li on:click={selectAlbum.bind(this, album, i)} add={true}>{album.title}</li>
	{/each}
</ul>
<button on:click={() => (showEdit = true)}>Add New Album</button>

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<AlbumInput bind:showEdit add={true} />
	</div>
{/if}
