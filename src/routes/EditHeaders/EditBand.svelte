<script>
	import { slide } from 'svelte/transition';
	import BandInput from '../Inputs/BandInput.svelte';
	import { selectedBand, selectedScreen, newBand } from '$/stores';
	let showEdit = false;

	$: console.log($selectedBand);
</script>

<band-name>
	<h2>{$selectedBand.title}</h2>
	<button
		on:click={() => {
			showEdit = !showEdit;
		}}
	>
		Edit
	</button>
	<button
		on:click={() => {
			$selectedScreen = 'bands';
			$selectedBand = $newBand;
		}}
	>
		Select Different Band
	</button>
</band-name>
{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<BandInput bind:showEdit />
	</div>
{/if}

<style>
	band-name {
		display: flex;
		align-items: center;
	}
	h2 {
		margin: 8px;
		width: 50%;
	}
</style>
