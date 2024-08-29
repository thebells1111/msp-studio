<script>
	import clone from 'just-clone';
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
	import Add from '$icons/Add.svelte';
	// import { slide } from 'svelte/transition';
	import Delete from '$icons/Delete.svelte';
	// import Publish from '../Publish/Publish.svelte';

	import { feeds, editingFeed, newFeed, remoteServer, catalogDB } from '$/stores';
	// import CloudUpload from '$icons/CloudUpload.svelte';

	async function selectBand(feed) {
		$editingFeed = feed;
		console.log(feed);
	}

	async function deleteFeed(feed) {
		const confirmed = window.confirm(`Are you sure you want to delete ${feed.title}?`);
		if (confirmed) {
			let guid = $editingFeed['podcast:guid'];
			$feeds = $feeds.filter((_feed) => _feed['podcast:guid'] !== feed['podcast:guid']);
			setTimeout(() => ($editingFeed = undefined), 50);
			await $catalogDB.removeItem(guid);
		}
	}

	async function addFeed() {
		$editingFeed = clone($newFeed);
		$editingFeed['podcast:guid'] = generateValidGuid();
		$feeds = $feeds.concat($editingFeed);
		await checkPodcastGuid($editingFeed);
		await $catalogDB.setItem($editingFeed['podcast:guid'], $editingFeed);
	}

	// function publishFeed(feed) {
	// 	publishingFeed = feed;
	// }

	// async function downloadZip(guid) {
	// 	const response = await fetch(remoteServer + `/api/download?guid=${guid}`);

	// 	if (response.status !== 200) {
	// 		throw new Error(
	// 			`Failed to download zip. Server responded with status code ${response.status}`
	// 		);
	// 	}

	// 	const blob = await response.blob();
	// 	const url = window.URL.createObjectURL(blob);
	// 	const a = document.createElement('a');
	// 	a.style.display = 'none';
	// 	a.href = url;
	// 	a.download = `${guid}.zip`;
	// 	document.body.appendChild(a);
	// 	a.click();
	// 	window.URL.revokeObjectURL(url);
	// }

	function generateValidGuid() {
		const namespace = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
		const inputString = uuidv4();
		return uuidv5(inputString, namespace);
	}

	async function checkPodcastGuid(feed) {
		let url =
			remoteServer +
			`/api/queryindex?q=${encodeURIComponent(`podcasts/byguid?guid=${feed['podcast:guid']}`)}`;
		console.log(url);
		const res = await fetch(url);
		const data = await res.json();
		if (data?.feed?.length) {
			feed['podcast:guid'] = generateValidGuid();
			await checkPodcastGuid(feed);
		}
	}
</script>

<div>
	<header>
		<h3>Albums</h3>
		<button class="add" on:click={addFeed}><Add /></button>
	</header>

	<overflow-container>
		<ul>
			{#each Object.entries($feeds || {}) as [key, feed]}
				<li class:selected={feed['podcast:guid'] === $editingFeed?.['podcast:guid']}>
					<album-info on:click={selectBand.bind(this, feed)}>
						<p>{feed.title || 'Blank Album'}</p>
						<p>{feed['itunes:author'] || 'Unknown Artist'}</p>
					</album-info>
					<button class="delete" on:click={deleteFeed.bind(this, feed)}><Delete /></button>
				</li>
			{/each}
		</ul>
	</overflow-container>
</div>

<style>
	div {
		height: calc(100%);
		width: 260px;
		overflow: hidden;
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 4px 0 4px;
	}

	overflow-container {
		height: 100%;
		overflow: auto;
	}

	h3 {
		margin: 8px 0 8px 4px;
	}

	button {
		color: var(--color-bg-add-band);
		background-color: transparent;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		min-width: 24px;
		font-size: 2em;
	}

	.add {
		position: relative;
		left: 1px;
	}

	.delete {
		font-size: 1.3em;
		color: red;
	}

	ul {
		padding: 0 0 40px 0px;
		margin: 0 0 0 0;
		width: 260px;
	}
	li {
		list-style: none;
		margin: 0;
		padding: 4px 0 4px 8px;
		display: flex;
		justify-content: space-between;
	}

	li.selected {
		background-color: var(--color-input-bg-0);
	}
	li:hover {
		background-color: var(--color-poster-bg-0);
		color: var(--color-text-0);
	}

	album-info {
		display: block;
		width: 100%;
	}

	album-info > p {
		padding: 0;
		margin: 0;
	}

	album-info > p:nth-of-type(2) {
		font-style: italic;
		font-size: 0.8em;
		padding-left: 8px;
	}
</style>
