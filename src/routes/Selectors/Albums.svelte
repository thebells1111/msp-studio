<script>
	import { slide } from 'svelte/transition';
	import AlbumInput from './Inputs/AlbumInput.svelte';
	import Add from '$icons/Add.svelte';
	import Delete from '$icons/Delete.svelte';
	import Publish from '../Publish/Publish.svelte';
	import postFeeds from '$routes/functions/postFeeds.js';

	import { feeds, editingFeed, remoteServer } from '$/stores';
	import CloudUpload from '$icons/CloudUpload.svelte';
	import DownloadIcon from '$icons/Download.svelte';

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
		postFeeds($feeds);
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
					<button class="publish" on:click|stopPropagation={publishFeed.bind(this, feed)}>
						<CloudUpload size="27" />
						<p>Publish</p>
					</button>

					<!-- <button class="download" on:click={downloadZip.bind(this, feed['podcast:guid'])}>
						<DownloadIcon size="27" />
						<p>Download</p>
					</button> -->
					<h3>{feed.title || 'Blank Album'} by {feed['itunes:author'] || 'Unknown Artist'}</h3>
					<button on:click|stopPropagation={deleteFeed.bind(this, feed)} class="delete">
						<Delete
							size="30
						"
						/>
					</button>
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

	.click-help > span {
		font-size: 1.5em;
	}

	overflow-container {
		display: block;
		height: calc(100% - 50px);
		overflow: auto;
	}
	ul {
		padding: 0 0 40px 0px;
		margin: 0 0 0 0;
	}
	li {
		list-style: none;
		display: flex;
		align-items: center;
		margin: 0 8px 8px 0;
		padding: 4px;
		border-radius: 6px;
		min-height: 60px;
		background-color: var(--color-poster-bg-0);
		box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.75);
	}

	li h3 {
		margin: 0 8px;
		padding: 0;
		width: 100%;
	}

	button.delete {
		color: var(--color-bg-delete);
		margin: 0;
		padding: 8px;
		filter: drop-shadow(0px 4px 2px rgb(0 0 0 / 0.5));
	}

	button.publish,
	button.download {
		display: flex;
		flex-direction: column;
		position: relative;
		filter: drop-shadow(0px 4px 2px rgb(0 0 0 / 0.5));
		background-color: var(--color-bg-edit-album);
		min-width: 50px;
		min-height: 50px;
		border-radius: 50px;
		color: var(--color-text-0);
	}

	button.download {
		background-color: var(--color-bg-edit-band);
	}

	.publish > p,
	.download > p {
		margin: 0;
		font-size: 0.7em;
		position: relative;
		bottom: 4px;
	}

	.download > p {
		font-size: 0.6em;
	}

	@media screen and (max-width: 992px) {
	}
</style>
