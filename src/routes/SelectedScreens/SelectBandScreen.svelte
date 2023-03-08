<script>
	import { slide } from 'svelte/transition';
	import BandInput from '../Inputs/BandInput.svelte';

	import {
		library,
		selectedBand,
		selectedBandIndex,
		selectedAlbum,
		newAlbum,
		selectedTrack,
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
</script>

<h3>Select a Band</h3>
<ul>
	{#each $library as band, i}
		<li on:click={selectBand.bind(this, band, i)}>{band.title}</li>
	{/each}
</ul>
<button on:click={() => (showEdit = true)}>Add New Band</button>
{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<BandInput bind:showEdit add={true} />
	</div>
{/if}
