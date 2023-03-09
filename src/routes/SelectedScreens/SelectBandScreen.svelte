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
		$selectedBandIndex = index || $selectedBandIndex;
		$library.splice($selectedBandIndex, 1);
		$library = $library;
		$selectedBandIndex = -1;
		$selectedAlbumIndex = -1;
		$selectedTrackIndex = -1;
		$catalogDB.removeItem($selectedBand.title);
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
		<li>
			<button
				on:click={deleteItem.bind(this, band.title || 'Blank Band', deleteBand.bind(this, i))}
				class="delete"
			>
				<Delete size="18" />
			</button>
			<p on:click={selectBand.bind(this, band, i)}>{band.title || 'Blank Band'}</p>
		</li>
	{/each}
</ul>

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<BandInput bind:showEdit add={true} />
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

	li {
		display: flex;
		list-style: none;
		padding: 4px 0;
	}

	p {
		padding: 0;
		margin: 0 8px;
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

	button.delete {
		color: var(--color-bg-delete);
	}
</style>
