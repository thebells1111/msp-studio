<script>
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';
	import { onMount } from 'svelte';

	import {
		library,
		catalogDB,
		selectedBand,
		selectedAlbum,
		selectedAlbumIndex,
		selectedTrack,
		selectedTrackIndex,
		selectedScreen
	} from '$/stores';

	export let add = false;
	let showAddNewButton = true;
	let newTrackName = '';
	let newTrackImage = '';
	let newTrackEnclosure = '';
	let newTrackValue = [];
	let showValueBlock = false;

	onMount(() => {
		console.log($selectedTrack);
		newTrackName = $selectedTrack.title || '';
		newTrackImage = $selectedTrack.artwork || '';
		newTrackEnclosure = $selectedTrack.url || '';
		newTrackValue = $selectedTrack.value || [];
	});

	async function addNewTrack() {
		let track = {
			title: newTrackName,
			artwork: newTrackImage,
			url: newTrackEnclosure,
			value: []
		};
		$selectedTrack = track;
		$selectedAlbum.tracks = $selectedAlbum.tracks.concat(track);
		$catalogDB.setItem($selectedBand.title, $selectedBand);
		$selectedScreen = 'trackEditor';
	}

	async function saveTrack() {
		console.log(newTrackValue);
		$selectedTrack.title = newTrackName;
		$selectedTrack.artwork = newTrackImage;
		$selectedTrack.url = newTrackEnclosure;
		$selectedTrack.value = newTrackValue;
		$selectedAlbum.tracks[$selectedTrackIndex] = $selectedTrack;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}

	$: console.log(newTrackValue);
</script>

{#if showAddNewButton && add}
	<button on:click={() => (showAddNewButton = false)}>Add New Track</button>
{:else}
	<div>
		<button on:click={() => (add ? addNewTrack() : saveTrack())}>
			{add ? 'Add Track' : 'Save Track'}
		</button>
		<img
			width="100"
			height="100"
			alt={$selectedTrack.artwork
				? `${`${$selectedTrack.title} ` || ''}cover art`
				: 'add Track Image link'}
			src={$selectedTrack.artwork}
		/>
		<label>
			<p>Track Name (required)</p>
			<input bind:value={newTrackName} />
		</label>

		<label>
			<p>Link to Track Image (optional)</p>
			<input bind:value={newTrackImage} />
		</label>

		<label>
			<p>Link to Track mp3 File (required)</p>
			<input bind:value={newTrackEnclosure} />
		</label>

		<button
			style="display:block"
			on:click={() => {
				showValueBlock = true;
			}}
		>
			Edit Value 4 Value
		</button>

		{#if showValueBlock}
			<ValueBlock bind:valueBlock={newTrackValue} />
		{/if}
	</div>
{/if}

<style>
	div {
		margin: 1em 0 0 0;
	}

	label {
		padding: 0 1em 0 0;
		margin: 8px;
	}

	p {
		padding: 0;
		margin: 0;
	}

	input {
		margin-bottom: 16px;
	}
</style>
