<script>
	import clone from 'just-clone';
	import { v4 as uuidv4 } from 'uuid';
	import Add from '$icons/Add.svelte';
	import Delete from '$icons/Delete.svelte';
	import initializeAlbum from '../functions/initializeAlbum';
	import generateValidGuid from '$functions/generateValidGuid.js';

	import { feeds, editingFeed, _newFeed, remoteServer, feedDB, MSPValue } from '$/stores';
	// import CloudUpload from '$icons/CloudUpload.svelte';

	async function selectBand(feedKey) {
		let feed = initializeAlbum($feeds[feedKey]); // Create a new object
		console.log(feed);
		$feeds[feedKey] = feed; // Replace the original feed in $feeds with the new object

		const itemsMissingGuids = feed.item.some((item) => !item.guid);
		const oldMSPValue = feed.item.some((item) =>
			item?.['podcast:value']?.['podcast:valueRecipient']?.some(
				(v) =>
					v?.['@_address'] ===
						'030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3' &&
					v?.['@_customKey'] === '696969' &&
					v?.['@_customValue'] === 'UzrnTK2oEHR55gw7Djmb'
			)
		);

		console.log(oldMSPValue);

		if (itemsMissingGuids || oldMSPValue) {
			feed.item.forEach((item) => {
				if (!item.guid) {
					item.guid = generateUniqueGuid(feed.item);
				}

				let oldMSPValueIndex = item?.['podcast:value']?.['podcast:valueRecipient']?.findIndex(
					(v) =>
						v?.['@_address'] ===
							'030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3' &&
						v?.['@_customKey'] === '696969' &&
						v?.['@_customValue'] === 'UzrnTK2oEHR55gw7Djmb'
				);

				if (oldMSPValueIndex > -1 && item?.['podcast:value']?.['podcast:valueRecipient']) {
					item['podcast:value']['podcast:valueRecipient'][oldMSPValueIndex] = clone(MSPValue);
				}
			});

			$editingFeed = feed; // Now $editingFeed and the feed in $feeds reference the same object
		}

		function generateUniqueGuid(items) {
			let guid;
			let retries = 10;

			do {
				guid = uuidv4();
				retries--;
			} while (items.some((item) => item.guid && item.guid['#text'] === guid) && retries > 0);

			return { '@_PermaLink': 'false', '#text': guid };
		}

		console.log(feed);
	}

	async function deleteFeed(feed) {
		const confirmed = window.confirm(`Are you sure you want to delete ${feed.title}?`);
		if (confirmed) {
			let guid = $editingFeed['podcast:guid'];
			$feeds = $feeds.filter((_feed) => _feed['podcast:guid'] !== feed['podcast:guid']);
			setTimeout(() => ($editingFeed = undefined), 50);
			await $feedDB.removeItem(guid);
		}
	}

	async function addFeed() {
		$editingFeed = clone(_newFeed);
		$editingFeed['podcast:guid'] = await generateValidGuid();
		await checkPodcastGuid($editingFeed);
		$feeds = $feeds.concat($editingFeed);
	}

	async function checkPodcastGuid(feed) {
		let url =
			remoteServer +
			`/api/queryindex?q=${encodeURIComponent(`podcasts/byguid?guid=${feed['podcast:guid']}`)}`;
		console.log(url);
		const res = await fetch(url);
		const data = await res.json();
		if (data?.feed?.length) {
			feed['podcast:guid'] = await generateValidGuid();
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
					<album-info on:click={selectBand.bind(this, key)}>
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
		position: relative;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px 4px 0 4px;
	}

	overflow-container {
		display: block;
		height: calc(100% - 102px);
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
		color: var(--color-bg-delete);
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
