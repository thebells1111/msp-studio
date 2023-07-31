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
	<album-name>
		<button
			on:click={() => {
				showEdit = !showEdit;
			}}
		>
			<span class="edit-circle">
				<span class="edit-circle-inner">
					<EditSquare size={22} />
				</span>
			</span>

			<h2>{$selectedAlbum.title || 'Blank Album'}</h2>
		</button>
	</album-name>
	<button
		on:click={() => {
			$selectedScreen = 'albums';
			$selectedAlbum = $newAlbum;
		}}
		class="select-album"
	>
		Select Different Album
	</button>
</album>

<style>
	album {
		display: flex;
		flex-direction: column;
		margin: 0 0 8px 0px;
	}

	album-name button {
		display: flex;
		width: 100%;
		align-items: center;
		margin-bottom: 8px;
	}

	button.select-album {
		width: 203px;
		background-color: var(--color-bg-select-album);
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
		color: var(--color-text-0);
		padding: 8px;
		margin: 0 16px 8px 16px;
	}
	h2 {
		margin: 0 0 0 8px;
		text-align: left;
	}

	button {
		background-color: transparent;
		padding: 0;
	}

	.edit-circle {
		display: flex;
		height: 40px;
		width: 40px;
		background-color: var(--color-bg-edit-album);
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
	}
</style>
