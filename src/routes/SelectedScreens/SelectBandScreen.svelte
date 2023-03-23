<script>
	import { slide } from 'svelte/transition';
	import BandInput from '../Inputs/BandInput.svelte';
	import Add from '../icons/Add.svelte';
	import Delete from '../icons/Delete.svelte';

	import deleteItem from '../functions/deleteItem';

	import {
		library,
		selectedBand,
		selectedBandIndex,
		selectedAlbum,
		selectedAlbumIndex,
		newAlbum,
		selectedTrack,
		selectedTrackIndex,
		catalogDB,
		selectedScreen
	} from '$/stores';

	let showEdit = false;

	async function selectBand(band, index) {
		$selectedBand = band;
		$selectedAlbum = $newAlbum;
		$selectedTrack = '';
		$selectedScreen = 'albums';
		$selectedBandIndex = index;
	}

	async function deleteBand(index) {
		let band = $library.splice(index, 1)[0];
		$library = $library;
		$selectedBandIndex = -1;
		$selectedAlbumIndex = -1;
		$selectedTrackIndex = -1;
		$catalogDB.removeItem(band.title);
	}
</script>

<header>
	<h3>Select a Band</h3>
	<button on:click={() => (showEdit = true)}>
		<Add size="30" />
	</button>
</header>
<ul>
	{#each $library as band, i}
		<li on:click={selectBand.bind(this, band, i)}>
			<h3>{band.title || 'Blank Band'}</h3>
			<button
				on:click={deleteItem.bind(this, band.title || 'Blank Band', deleteBand.bind(this, i))}
				class="delete"
			>
				<Delete
					size="30
				"
				/>
			</button>
		</li>
	{/each}
</ul>

{#if showEdit}
	<div transition:slide={{ duration: 25 }}>
		<BandInput bind:showEdit add={true} />
	</div>
{/if}

<style>
	header {
		display: flex;
		align-items: center;
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

	ul {
		padding: 0 0 0 16px;
		margin: 16px 0 0 0;
	}
	li {
		list-style: none;
		display: flex;
		align-items: center;
		margin: 0 8px 8px 0;
		padding: 4px;
		border-radius: 6px;
		min-height: 55px;
		background-color: var(--color-poster-bg-0);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}

	li h3 {
		margin: 0 8px;
		padding: 0;
		width: 100%;
	}

	button.delete {
		color: var(--color-bg-delete);
		margin: 0;
		padding: 8px;
		filter: drop-shadow(0px 4px 2px rgb(0 0 0 / 0.5));
	}
</style>
