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

	<h2>{$selectedTrack.title}</h2>
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
		align-items: flex-start;
		margin-left: 64px;
		margin-bottom: 24px;
	}
	h2 {
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

	.select {
		width: 203px;
	}
</style>
