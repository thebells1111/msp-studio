<script>
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ChangeBand from './ChangeBand.svelte';
	import ChangeAlbum from './ChangeAlbum.svelte';
	import TrackInput from '../Inputs/TrackInput.svelte';
	import Add from '../icons/Add.svelte';
	import ExpandMore from '../icons/ExpandMore.svelte';
	import ExpandLess from '../icons/ExpandLess.svelte';
	import EditSquare from '../icons/EditSquare.svelte';
	import Delete from '../icons/Delete.svelte';
	import deleteItem from '../functions/deleteItem';
	import Publish from '../Publish/Publish.svelte';

	import {
		selectedBand,
		selectedAlbum,
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
		console.log($selectedAlbum.tracks);
		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}

	function sortTracks(index, direction) {
		const newArray = [...$selectedAlbum.tracks];
		let a = newArray[index];
		let b = newArray[index + direction];
		newArray[index + direction] = a;
		newArray[index] = b;

		$selectedAlbum.tracks = newArray;
		$catalogDB.setItem($selectedBand.title, $selectedBand);
	}
</script>

<ChangeBand />
<ChangeAlbum />
<Publish />
<select-track>
	<header>
		<header-top>
			<h3>Select a Track</h3>
			<button
				on:click={() => {
					addNewTrack();
					showEdit = true;
				}}
			>
				<Add size="30" />
			</button>
		</header-top>
	</header>
	<ul>
		{#each $selectedAlbum?.tracks || [] as track, i}
			<li on:click={selectTrack.bind(this, track, i)}>
				<sorter>
					{#if i !== 0}
						<button on:click|stopPropagation={sortTracks.bind(this, i, -1)}>
							<ExpandLess size="30" />
						</button>
					{:else}
						<spacer />
					{/if}
					{#if i !== ($selectedAlbum?.tracks || []).length - 1}
						<button on:click|stopPropagation={sortTracks.bind(this, i, 1)}>
							<ExpandMore size="30" />
						</button>
					{:else}
						<spacer />
					{/if}
				</sorter>
				<p>
					<EditSquare />
					{track.title || 'Blank Track'}
				</p>
				<button
					on:click|stopPropagation={deleteItem.bind(
						this,
						track.title || 'Blank Track',
						deleteTrack.bind(this, i)
					)}
					class="delete"
				>
					<Delete size="30" />
				</button>
			</li>
		{/each}
	</ul>
</select-track>

{#if showEdit}
	<div transition:slide={{ duration: 50 }}>
		<TrackInput bind:showEdit />
	</div>
{/if}

<style>
	header-top {
		display: flex;
		align-items: center;
	}
	h3 {
		margin: 0;
	}

	p {
		margin: 0;
	}
	ul {
		padding: 0 0 0 16px;
	}

	li {
		list-style: none;
		display: flex;
		background-color: black;
		margin: 0 8px 8px 0;
		padding: 4px;
		border-radius: 6px;
		min-height: 55px;
		background-color: var(--color-poster-bg-0);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}

	sorter {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	sorter button {
		margin: 0;
		padding: 0 16px 0 0;
		height: 26px;
	}

	li p {
		width: 100%;
	}

	select-track {
		display: block;
		position: relative;
		left: 232px;
		top: -225px;
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

	button.delete {
		color: var(--color-bg-delete);
		margin: 0;
		padding: 8px;
		filter: drop-shadow(0px 4px 2px rgb(0 0 0 / 0.5));
	}
</style>
