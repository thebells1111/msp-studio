<script>
	import clone from 'just-clone';
	import Add from '$icons/Add.svelte';
	import ExpandMore from '$icons/ExpandMore.svelte';
	import ExpandLess from '$icons/ExpandLess.svelte';
	import Delete from '$icons/Delete.svelte';
	import TrackInput from './Inputs/TrackInput.svelte';
	import postFeeds from '$routes/functions/postFeeds.js';
	export let albumValueBlock;

	import { feeds, editingFeed, selectedTrack, selectedTrackIndex } from '$/stores';

	let showEdit = false;

	async function selectTrack(track, index) {
		console.log(track);
		$selectedTrack = track;
		$selectedTrackIndex = index;
		showEdit = true;
	}

	async function deleteTrack(index) {
		$editingFeed.item.splice(index, 1);
		$editingFeed.item = $editingFeed.item;
		$feeds[$editingFeed['podcast:guid']] = $editingFeed;
		postFeeds($feeds);
	}

	async function addNewTrack() {
		let track = {
			'podcast:value': clone(albumValueBlock) || {
				'@_type': 'lightning',
				'@_method': 'keysend',
				'podcast:valueRecipient': []
			}
		};

		$editingFeed.item = $editingFeed.item.concat(track);
		$selectedTrack = track;
		$selectedTrackIndex = $editingFeed.item.length - 1;
		showEdit = true;
	}

	function sortTracks(index, direction) {
		const newArray = clone($editingFeed.item);
		let a = newArray[index];
		let b = newArray[index + direction];
		newArray[index + direction] = a;
		newArray[index] = b;

		$editingFeed.item = newArray;
		$feeds[$editingFeed['podcast:guid']] = $editingFeed;
		postFeeds($feeds);
	}
</script>

<select-track>
	<header>
		<header-top>
			<h3>Add a Track</h3>
			<button on:click={addNewTrack}>
				<Add size="30" />
			</button>
		</header-top>
	</header>

	{#if $editingFeed?.item?.length}
		<ul>
			{#each $editingFeed.item || [] as track, i}
				<li on:click={selectTrack.bind(this, track, i)}>
					<sorter>
						{#if i !== 0}
							<button on:click|stopPropagation={sortTracks.bind(this, i, -1)}>
								<ExpandLess size="30" />
							</button>
						{:else}
							<spacer />
						{/if}
						{#if i !== ($editingFeed?.item || []).length - 1}
							<button on:click|stopPropagation={sortTracks.bind(this, i, 1)}>
								<ExpandMore size="30" />
							</button>
						{:else}
							<spacer />
						{/if}
					</sorter>
					<p>
						{track?.title || 'Blank Track'}
					</p>
					<button on:click|stopPropagation={deleteTrack.bind(this, i)} class="delete">
						<Delete size="30" />
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="click-help"><span>↑</span> Click here to <br /> add your first track</p>
	{/if}
</select-track>

{#if showEdit}
	<div>
		<TrackInput bind:showEdit />
	</div>
{/if}

<style>
	h3 {
		font-size: 1.5em;
	}

	header-top {
		display: flex;
		align-items: center;
	}
	h3 {
		margin: 0;
	}

	select-track {
		display: block;
		width: calc(100% - 16px);
		height: 100%;
		margin-top: 8px;
		flex-grow: 1;
		overflow: hidden;
		position: relative;
		min-height: 150px;
	}
	ul {
		padding: 0 0 0 8px;
		height: calc(100% - 34px);
		overflow: auto;
	}

	li {
		list-style: none;
		display: flex;
		background-color: black;
		margin: 0 8px 8px 0;
		padding: 4px;
		border-radius: 6px;
		height: 40px;
		min-height: 40px;
		background-color: var(--color-poster-bg-0);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}

	li > p {
		flex: 1;
		margin: 0;
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
		height: 20px;
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

	.click-help {
		font-size: 1.2em;
		color: red;
		position: absolute;
		top: 16px;
		left: 152px;
	}

	.click-help > span {
		font-size: 1.5em;
	}
</style>
