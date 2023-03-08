<script>
	import { slide } from 'svelte/transition';
	import EditBand from '../EditHeaders/EditBand.svelte';
	import EditAlbum from '../EditHeaders/EditAlbum.svelte';
	import TrackInput from '../Inputs/TrackInput.svelte';

	import { selectedAlbum, selectedTrack, selectedTrackIndex } from '$/stores';

	async function selectTrack(track, index) {
		$selectedTrack = track;
		$selectedTrackIndex = index;
		showEdit = true;
	}

	let showEdit = false;
	let addTrack = false;
</script>

<EditBand />

<container>
	<left-pane>
		<EditAlbum />
	</left-pane>
	<right-pane>
		<h4>Select a Track</h4>
		<ul>
			{#each $selectedAlbum?.tracks || [] as track, i}
				<li on:click={selectTrack.bind(this, track, i)}>{track.title}</li>
			{/each}
		</ul>
		<button
			on:click={() => {
				showEdit = true;
				addTrack = true;
			}}
		>
			Add New Track
		</button>
	</right-pane>
</container>

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<TrackInput bind:showEdit add={addTrack} />
	</div>
{/if}

<style>
	container {
		display: flex;
	}
	left-pane,
	right-pane {
		width: 50%;
	}

	h4 {
		margin: 0 0 8px 0;
	}
</style>
