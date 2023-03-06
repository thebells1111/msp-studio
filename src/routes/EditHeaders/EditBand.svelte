<script>
	import { slide } from 'svelte/transition';
	import BandInput from '../Inputs/BandInput.svelte';
	import { selectedBand, selectedScreen, newBand } from '$/stores';
	let showEdit = false;

	$: console.log($selectedBand);
</script>

<band-name>
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
		class="select"
	>
		Select Different Band
	</button>
	<h1>{$selectedBand.title}</h1>
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
		margin-bottom: 8px;
	}
	h1 {
		margin: 0;
		margin-left: 8px;
	}

	.select {
		width: 203px;
	}
</style>
