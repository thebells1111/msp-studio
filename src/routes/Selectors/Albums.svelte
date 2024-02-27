<script>
	import { slide } from 'svelte/transition';
	import AlbumInput from './Inputs/AlbumInput.svelte';
	import Add from '$icons/Add.svelte';
	import Delete from '$icons/Delete.svelte';
	import Publish from '../Publish/Publish.svelte';

	import { feeds, editingFeed, remoteServer } from '$/stores';
	import CloudUpload from '$icons/CloudUpload.svelte';

	let showEdit = false;
	let publishingFeed;

	async function selectBand(feed) {
		showEdit = true;
		$editingFeed = feed;
		console.log($editingFeed);
	}

	async function deleteFeed(feed) {
		console.log($feeds);
		delete $feeds[feed['podcast:guid']];
		$feeds = $feeds;
	}

	function addFeed() {
		showEdit = true;
		$editingFeed = {};
	}

	function publishFeed(feed) {
		publishingFeed = feed;
	}

	async function downloadZip(guid) {
		const response = await fetch(remoteServer + `/api/download?guid=${guid}`);

		if (response.status !== 200) {
			throw new Error(
				`Failed to download zip. Server responded with status code ${response.status}`
			);
		}

		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = `${guid}.zip`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
	}
</script>

<div>
	<header>
		<h3>Albums</h3>
	</header>

	{#if Object.keys($feeds).length === 0}
		<p class="click-help">Click here to add your first album <span>↓</span></p>
	{/if}
	<button class="add" on:click={addFeed}>
		<Add size="60" />
	</button>
	<overflow-container>
		<ul>
			{#each Object.entries($feeds || {}) as [key, feed]}
				<li on:click={selectBand.bind(this, feed)}>
					<p>{feed.title || 'Blank Album'}</p>
					<p>{feed['itunes:author'] || 'Unknown Artist'}</p>
				</li>
			{/each}
		</ul>
	</overflow-container>
</div>

{#if publishingFeed}
	<Publish feed={publishingFeed} onClose={() => (publishingFeed = null)} />
{/if}

{#if showEdit}
	<div transition:slide|global={{ duration: 25 }}>
		<AlbumInput bind:showEdit add={!$editingFeed['podcast:guid']} />
	</div>
{/if}

<style>
	div {
		height: calc(100%);
		overflow: hidden;
	}
	header {
		display: flex;
		align-items: center;
	}

	h3 {
		margin: 8px 0;
	}

	button {
		color: var(--color-bg-add-band);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 8px;
	}

	.add {
		position: fixed;
		bottom: 8px;
		right: 8px;
		z-index: 32;
	}

	.click-help {
		font-size: 1.3em;
		color: red;
		position: fixed;
		bottom: 58px;
		right: 32px;
	}

	ul {
		padding: 0 0 40px 0px;
		margin: 0 0 0 0;
		border-right: 1px solid var(--color-text-0);
		width: 250px;
	}
	li {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li:hover {
		background-color: var(--color-bg-add-band);
		color: var(--color-text-3);
	}

	li > p {
		padding: 0;
		margin: 0;
	}

	li > p:nth-of-type(2) {
		font-style: italic;
		font-size: 0.8em;
		padding-left: 8px;
	}
</style>
