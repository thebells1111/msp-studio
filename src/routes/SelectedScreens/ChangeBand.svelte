<script>
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
		<span class="edit-circle">
			<span class="edit-circle-inner">
				<EditSquare size={22} />
			</span>
		</span>

		<h2>{$selectedBand.title || 'Blank Band'}</h2>
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
	<div>
		<BandInput bind:showEdit />
	</div>
{/if}

<style>
	band-name {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
	band-name button {
		display: flex;
		align-items: center;
		background-color: transparent;
		padding: 0;
	}
	h2 {
		margin: 0 0 0 8px;
		text-align: left;
	}

	button.select-band {
		width: 203px;
		background-color: var(--color-bg-select-band);
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
		margin: 0 16px 8px 16px;
	}

	.edit-circle {
		display: flex;
		height: 42px;
		width: 42px;
		background-color: var(--color-bg-edit-band);
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}
</style>
