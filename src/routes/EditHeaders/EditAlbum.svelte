<script>
	import { slide } from 'svelte/transition';
	import AlbumInput from '../Inputs/AlbumInput.svelte';
	import { selectedAlbum, selectedScreen, newAlbum } from '$/stores';
	let showEdit = false;
</script>

<album-name>
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
		class="select"
	>
		Select Different Album
	</button>

	<h2>{$selectedAlbum.title}</h2>
	<img
		width="150"
		height="150"
		alt={$selectedAlbum.artwork
			? `${`${$selectedAlbum.title} ` || ''}cover art`
			: 'add Album Image link'}
		src={$selectedAlbum.artwork}
	/>
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
		margin-bottom: 8px;
	}
	h2 {
		margin: 0;
		margin-left: 16px;
		flex-grow: 1;
	}

	img {
		border: 1px solid black;
		position: absolute;
		right: 8px;
		top: 68px;
	}

	button {
		background-color: var(--color-bg-edit-album);
	}

	button.select {
		width: 203px;
		background-color: var(--color-bg-select-album);
	}
</style>
