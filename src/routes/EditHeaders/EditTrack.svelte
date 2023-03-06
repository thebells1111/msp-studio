<script>
	import { slide } from 'svelte/transition';
	import TrackInput from '../Inputs/AlbumInput.svelte';
	import { selectedTrack, selectedScreen, newTrack } from '$/stores';
	let showEdit = false;
</script>

<track-name>
	<img
		width="100"
		height="100"
		alt={$selectedTrack.artwork
			? `${`${$selectedTrack.title} ` || ''}cover art`
			: 'add Track Image link'}
		src={$selectedTrack.artwork}
	/>
	<h2>{$selectedTrack.title}</h2>

	<button
		on:click={() => {
			$selectedScreen = 'tracks';
			$selectedTrack = $newTrack;
		}}
	>
		Select Different Track
	</button>
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
		margin-left: 64px;
	}
	h2 {
		margin: 8px 16px;
		width: 50%;
	}

	img {
		border: 1px solid black;
	}

	audio {
		margin: 8px 64px;
		width: calc(100% - 128px);
	}
</style>
