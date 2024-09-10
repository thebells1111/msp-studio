<script>
	import clone from 'just-clone';
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
	import MainMenu from '../MainMenu.svelte';
	import AlbumsList from './AlbumsList.svelte';
	import Album from './Album.svelte';
	import Track from './Track.svelte';
	import AddIcon from '$icons/Add.svelte';
	import SwapVertIcon from '$icons/SwapVert.svelte';

	import { MSPValue, editingFeed, newTrack, catalogDB } from '$/stores';
	import Modal from '../Modals/Modals.svelte';
	import TrackSorter from './TrackSorter.svelte';

	let showTrackSorter = false;

	$: trackLength = $editingFeed?.item?.length;

	async function addTrack() {
		let _newTrack = clone($newTrack);
		_newTrack.guid = generateUniqueGuid($editingFeed.item);
		$editingFeed.item = $editingFeed.item.concat(_newTrack);
		await $catalogDB.setItem($editingFeed['podcast:guid'], $editingFeed);

		function generateUniqueGuid(items) {
			let guid = generateValidGuid();
			let maxRetries = 10; // Prevents potential infinite loops

			while (items.some((item) => item.guid && item.guid['#text'] === guid) && maxRetries > 0) {
				guid = generateValidGuid();
				maxRetries--;
			}

			return {
				'@_PermaLink': 'false',
				'#text': guid
			};
		}

		function generateValidGuid() {
			const namespace = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
			const inputString = uuidv4();
			return uuidv5(inputString, namespace);
		}
	}
</script>

<MainMenu />

<main>
	<AlbumsList />
	<editors>
		{#if $editingFeed}
			<h2>Album</h2>
			<Album />
			<track-header>
				<button
					class="track-sorter"
					on:click={() => {
						showTrackSorter = true;
					}}
				>
					<SwapVertIcon size="76" />
				</button>
				<h2>Tracks {trackLength > 0 ? `(${trackLength} Total)` : ''}</h2>
				<button class="add" on:click={addTrack}>
					<AddIcon size="28" />
				</button>
			</track-header>
			{#each $editingFeed.item as track, i}
				<Track bind:track trackNumber={i + 1} />
			{/each}
		{/if}
	</editors>
</main>

{#if showTrackSorter && $editingFeed?.item?.length > 1}
	<Modal
		closeModal={() => {
			$editingFeed.item = $editingFeed.item;
			showTrackSorter = false;
		}}
	>
		<TrackSorter bind:tracks={$editingFeed.item} />
	</Modal>
{/if}

<style>
	main {
		position: relative;
		height: calc(100% - 38px);
		width: 100vw;
		overflow: hidden;
		display: flex;
	}

	editors {
		display: flex;
		flex-direction: column;
		overflow: auto;
		width: calc(100% - 260px);
	}

	h2 {
		margin: 0;
		text-align: center;
	}

	button {
		color: var(--color-bg-add-band);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2em;
		overflow: hidden;
	}

	track-header {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 10%,
			var(--color-poster-bg-1) 95%
		);
		height: 36px;
	}

	.add {
		margin-left: 8px;
		width: 32px;
		min-width: 32px;
	}

	.track-sorter {
		margin-right: 2px;
		width: 32px;
		min-width: 32px;
		height: 32px;
	}
</style>
