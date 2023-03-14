<script>
	import { slide } from 'svelte/transition';
	import ChangeBand from './ChangeBand.svelte';
	import ChangeAlbum from './ChangeAlbum.svelte';
	import TrackInput from '../Inputs/TrackInput.svelte';
	import Add from '../icons/Add.svelte';
	import EditSquare from '../icons/EditSquare.svelte';
	import Delete from '../icons/Delete.svelte';
	import deleteItem from '../functions/deleteItem';
	import Publish from '../Publish/Publish.svelte';

	import {
		selectedBand,
		selectedBandIndex,
		selectedAlbum,
		selectedAlbumIndex,
		selectedTrack,
		selectedTrackIndex,
		catalogDB,
		MSPValue
	} from '$/stores';

	let showEdit = false;

	async function selectTrack(track, index) {
		$selectedTrack = track;
		$selectedTrackIndex = index;
		showEdit = true;
	}

	async function deleteTrack(index) {
		$selectedAlbum.tracks.splice(index, 1);
		$selectedAlbum = $selectedAlbum;
		$selectedTrackIndex = -1;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}

	async function addNewTrack() {
		let track = {
			title: '',
			artwork: '',
			url: '',
			value: $selectedAlbum.value ? [...$selectedAlbum.value] : [...$MSPValue],
			description: '',
			explicit: 'no'
		};
		$selectedTrack = track;
		$selectedAlbum.tracks = $selectedAlbum.tracks.concat(track);
		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}
</script>

<ChangeBand />
<ChangeAlbum />
<select-track>
	<header>
		<h3>Select a Track</h3>
		<button
			on:click={() => {
				addNewTrack();
				showEdit = true;
			}}
		>
			<Add size="30" />
		</button>
	</header>
	<ul>
		{#each $selectedAlbum?.tracks || [] as track, i}
			<li>
				<button
					on:click={deleteItem.bind(this, track.title || 'Blank Track', deleteTrack.bind(this, i))}
					class="delete"
				>
					<Delete size="18" />
				</button>
				<p on:click={selectTrack.bind(this, track, i)}>
					<EditSquare />
					{track.title || 'Blank Track'}
				</p>
			</li>
		{/each}
	</ul>
</select-track>

<Publish />

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<TrackInput bind:showEdit />
	</div>
{/if}

<style>
	header {
		display: flex;
		align-items: center;
	}
	h3 {
		margin: 0;
	}
	ul {
		padding: 0 0 0 16px;
	}

	li {
		list-style: none;
		display: flex;
	}

	select-track {
		display: block;
		position: relative;
		left: 232px;
		top: -175px;
		width: calc(100% - 232px);
	}

	button {
		color: var(--color-bg-select-track);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 8px;
	}

	p {
		margin: 0;
	}

	button.delete {
		color: var(--color-bg-delete);
		margin: 0 8px 0 0;
	}
</style>
