<script>
	import { slide } from 'svelte/transition';
	import AlbumInput from '../Inputs/AlbumInput.svelte';
	import { selectedAlbum, selectedScreen, newAlbum } from '$/stores';
	let showEdit = false;
</script>

<album-name>
	<img
		width="100"
		height="100"
		alt={$selectedAlbum.artwork
			? `${`${$selectedAlbum.title} ` || ''}cover art`
			: 'add Album Image link'}
		src={$selectedAlbum.artwork}
	/>
	<h2>{$selectedAlbum.title}</h2>
	<button
		on:click={() => {
			showEdit = !showEdit;
		}}
	>
		Edit
	</button>
	<button
		on:click={() => {
			$selectedScreen = 'albums';
			$selectedAlbum = $newAlbum;
		}}
	>
		Select Different Album
	</button>
</album-name>

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<AlbumInput bind:showEdit />
	</div>
{/if}

<style>
	album-name {
		display: flex;
		align-items: center;
		margin-left: 32px;
	}
	h2 {
		margin: 8px 16px;
		width: 50%;
	}

	img {
		border: 1px solid black;
	}
</style>
