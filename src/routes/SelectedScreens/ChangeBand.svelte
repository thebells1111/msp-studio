<script>
	import { slide } from 'svelte/transition';
	import BandInput from '../Inputs/BandInput.svelte';
	import EditSquare from '../icons/EditSquare.svelte';
	import { selectedBand, selectedScreen, newBand } from '$/stores';
	let showEdit = false;

	$: console.log($selectedBand);
</script>

<band-name>
	<button
		class="edit-band"
		on:click={() => {
			showEdit = !showEdit;
		}}
	>
		<EditSquare size={24} />

		<h1>{$selectedBand.title || 'Blank Band'}</h1>
	</button>
</band-name>
<button
	class="select-band"
	on:click={() => {
		$selectedScreen = 'bands';
		$selectedBand = $newBand;
	}}
>
	Select Different Band
</button>
{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<BandInput bind:showEdit />
	</div>
{/if}

<style>
	band-name {
		display: block;
		margin-bottom: 8px;
	}
	band-name button {
		display: flex;
		align-items: center;
		background-color: transparent;
		padding: 0;
	}
	h1 {
		margin: 0 0 0 8px;
	}

	button.select-band {
		width: 203px;
		background-color: var(--color-bg-select-band);
		box-shadow: 0 2px 5px 0 var(--color-button-shadow);
		margin-bottom: 8px;
	}
</style>
