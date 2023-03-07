<script>
	import { slide } from 'svelte/transition';
	import TrackInput from '../Inputs/AlbumInput.svelte';
	import { selectedTrack, selectedScreen, newTrack } from '$/stores';
	let showEdit = false;
</script>

<track-name>
	<button
		on:click={() => {
			$selectedScreen = 'tracks';
			$selectedTrack = $newTrack;
		}}
		class="select"
	>
		Select Different Track
	</button>

	<h3>{$selectedTrack.title}</h3>
</track-name>

<audio src={$selectedTrack.url} controls />

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<TrackInput bind:showEdit />
	</div>
{/if}

<style>
	track-name {
		display: flex;
		align-items: center;
		margin-left: 66px;
		margin-bottom: 24px;
	}
	h3 {
		margin: 0;
		margin-left: 24px;
		flex-grow: 1;
	}

	img {
		border: 1px solid black;
	}

	audio {
		margin: 8px 64px;
		width: calc(100% - 128px);
	}

	button {
		background-color: var(--color-bg-edit-track);
	}

	button.select {
		width: 203px;
		background-color: var(--color-bg-select-track);
	}
</style>
