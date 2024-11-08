<script>
	import clone from 'just-clone';
	import { v4 as uuidv4 } from 'uuid';
	import AlbumsList from '$lib/Editor/AlbumsList.svelte';
	import BunnyCredentials from '$lib/Editor/Bunny/BunnyCredentials.svelte';
	import Settings from '$lib/Editor/Settings/Settings.svelte';
	import Album from '$lib/Editor/Album.svelte';
	import Track from '$lib/Editor/Tracks/Track.svelte';
	import AddIcon from '$icons/Add.svelte';
	import SwapVertIcon from '$icons/SwapVert.svelte';
	import Publish from '$lib/Editor/Publish/Publish.svelte';

	import { editingFeed, newTrack, menuPanel } from '$/stores';
	import Modal from '../Modals/Modals.svelte';
	import TrackSorter from './Tracks/TrackSorter.svelte';

	let showTrackSorter = false;

	$: trackLength = $editingFeed?.item?.length;

	async function addTrack() {
		let _newTrack = clone($newTrack);
		_newTrack.guid = generateUniqueGuid($editingFeed.item);
		console.log(_newTrack.guid);
		$editingFeed.item = $editingFeed.item.concat(_newTrack);

		function generateUniqueGuid(items) {
			let guid = uuidv4();
			let maxRetries = 10; // Prevents potential infinite loops

			while (items.some((item) => item.guid && item.guid['#text'] === guid) && maxRetries > 0) {
				guid = uuidv4();
				maxRetries--;
			}

			return {
				'@_PermaLink': 'false',
				'#text': guid
			};
		}
	}

	let activePanel = AlbumsList;
	$: console.log($menuPanel);
	$: if ($menuPanel === 'albums') {
		activePanel = AlbumsList;
	} else if ($menuPanel === 'bunnyCredentials') {
		activePanel = BunnyCredentials;
	} else if ($menuPanel === 'settings') {
		activePanel = Settings;
	}

	$: console.log($editingFeed);
</script>

<main>
	<svelte:component this={activePanel} />
	<editors>
		{#if $editingFeed}
			<album-header>
				<h2>Album</h2>
			</album-header>

			<Album />

			<track-header>
				{#if $editingFeed.item?.length > 1}
					<button
						class="track-sorter"
						on:click={() => {
							showTrackSorter = true;
						}}
					>
						<SwapVertIcon size="76" />
					</button>
				{:else}
					<spacer />
				{/if}
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
	{#if $editingFeed}
		<div class="publish">
			<Publish />
		</div>
	{/if}
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

	track-header > button {
		color: var(--color-bg-add-band);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2em;
		overflow: hidden;
	}

	album-header,
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

	spacer {
		display: block;
		width: 32px;
		min-width: 32px;
	}

	.publish {
		position: absolute;
		bottom: 8px;
		left: 7px;
		width: 246px;
	}
</style>
