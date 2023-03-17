<script>
	import AlbumInput from '../Inputs/AlbumInput.svelte';
	import EditSquare from '../icons/EditSquare.svelte';
	import { selectedAlbum, selectedScreen, newAlbum } from '$/stores';
	export let showEdit = false;
</script>

{#if showEdit}
	<div>
		<AlbumInput bind:showEdit />
	</div>
{/if}

<album>
	<img
		width="203"
		height="203"
		alt={$selectedAlbum.artwork
			? `${`${$selectedAlbum.title} ` || ''}cover art`
			: 'add Album Image link'}
		src={$selectedAlbum.artwork}
	/>

	<album-name>
		<button
			on:click={() => {
				showEdit = !showEdit;
			}}
		>
			<EditSquare size={22} />

			<h2>{$selectedAlbum.title || 'Blank Album'}</h2>
		</button>
	</album-name>
</album>

<button
	on:click={() => {
		$selectedScreen = 'albums';
		$selectedAlbum = $newAlbum;
	}}
	class="select-album"
>
	Select Different Album
</button>

<style>
	album {
		display: flex;
		margin: 0 0 8px 16px;
	}

	album-name button {
		display: flex;
		width: 100%;
		align-items: center;
		margin-bottom: 8px;
	}
	h2 {
		margin: 0 0 0 8px;
	}

	img {
		display: block;
		border: 1px solid black;
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}

	button {
		background-color: transparent;
		padding: 8px;
	}

	button.select-album {
		width: 203px;
		background-color: var(--color-bg-select-album);
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
		margin-left: 16px;
	}
</style>
