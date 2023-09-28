<script>
	import Close from '../icons/Close.svelte';
	import saveAs from 'file-saver';

	import { selectedAlbum, remoteServer } from '$/stores';

	export let showPublishModal = false;
	export let xmlFile;
	export let feed;

	let feedUrl = '';

	let displayText = ``;
	let duplicateEnclosure = false;

	export let onClose = () => {};

	function closeModal() {
		onClose();
		showPublishModal = false;
	}

	async function saveFeed(title, xmlFile) {
		displayText = `If updating your feed, remember to keep your file name the same as your old file.
		<br/> <br/>Then replace your old file with the new file.`;
		var blob = new Blob([xmlFile], { type: 'text/plain;charset=utf-8' });

		saveAs(blob, `${title.toLowerCase()}.xml`);
	}

	function checkEnclosure() {
		if ($selectedAlbum.enclosureUrl && $selectedAlbum.enclosureUrl !== feedUrl) {
			duplicateEnclosure = true;
			return;
		} else {
			checkPodcastIndex();
		}
	}

	async function checkPodcastIndex() {
		const guidUrl =
			remoteServer +
			`/api/queryindex?q=podcasts/byguid?guid=${encodeURIComponent(feed['podcast:guid'])}`;
		const guidRes = await fetch(guidUrl);
		const guidData = await guidRes.json();

		if (guidData.status === 'true' && guidData.feed.length) {
			podping();
		} else if (data?.status === 'false' && !guidData?.feed?.length) {
			// addFeed();
		}
	}

	async function podping() {
		let url = `api/podping?url=${encodeURIComponent(feedUrl)}&reason=update&medium=music`;

		console.log(url);

		const res = await fetch(url);
		const data = await res.text();
		if (data === 'Success!') {
			displayText =
				'Feed successfully updated. Please wait a few minutes for your changes to appear in the player.';
		} else {
			displayText = data;
		}
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<button class="close" on:click={closeModal}>
		<Close size="24" />
	</button>
	<modal>
		<button-container>
			<h3>
				Download your feed,
				<br />upload the file to your server folder,
				<br />then enter the link to your feed.
			</h3>
			<button class="download" on:click={saveFeed.bind(this, feed.title, xmlFile)}>
				Download Feed
			</button>
			<link-container>
				<label>
					<h4>Link to Feed (required)</h4>
					<input bind:value={feedUrl} />
				</label>
			</link-container>

			{#if feedUrl?.endsWith('.xml')}
				{#if duplicateEnclosure}
					<h3>That link doesn't match your previous link</h3>
					<h3>Here's your previous link:</h3>
					<h3>{$selectedAlbum.enclosureUrl}</h3>

					<button class="directory" on:click={checkEnclosure}
						>I'm positive my feed is not in the Podcast Index.<br />Add my feed.</button
					>
				{:else}
					<h3>Add your feed to the Podcast Index<br />or<br />Podping an existing feed.</h3>

					<button class="directory" on:click={checkEnclosure}>Update Podcast Index</button>
				{/if}
			{/if}
		</button-container>
		<warning>
			<h3>{@html displayText}</h3>
		</warning>
	</modal>
</blurred-background>

<style>
	blurred-background {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		position: fixed;
		background: transparent;
		top: 0;
		right: 0;
		z-index: 99;
		backdrop-filter: blur(5px);
	}

	modal {
		position: relative;
		width: calc(100% - 50px);
		height: calc(100% - 50px);
		overflow-y: auto;
		overflow-x: hidden;
		border-radius: 8px;
		padding: 8px;
		overflow: auto;
		background-color: var(--color-poster-bg-0);
		background-image: linear-gradient(
			180deg,
			var(--color-poster-bg-0) 33%,
			var(--color-poster-bg-1) 66%
		);
		box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.75);
	}

	.close {
		position: fixed;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 24px;
		color: rgba(255, 255, 255, 0.75);
		box-shadow: none;
		width: initial;
		z-index: 33;
	}

	link-container {
		display: block;
		margin: 64px 0 8px 0;
		display: relative;
		width: 100%;
	}

	button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	input {
		width: calc(100% - 24px);
		margin: 0 0 0 8px;
	}

	button {
		box-shadow: 0 3px 5px 0px var(--color-button-shadow);
		max-width: 720px;
		width: calc(100% - 16px);
	}

	.directory {
		background-color: var(--color-bg-add-directory);
		border-radius: 100px;
	}

	.download {
		background-color: var(--color-bg-download-feed);
	}

	h3 {
		text-align: center;
	}

	warning {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	warning h3 {
		color: red;
		font-weight: 800;
		text-align: center;
	}

	@media screen and (max-width: 992px) {
		modal {
			position: relative;
			width: calc(100%);
			height: calc(100% - 16px);
			overflow-y: auto;
			overflow-x: hidden;
			border-radius: 8px;
			padding: 8px;
			overflow: auto;
			background-color: var(--color-poster-bg-0);
			background-image: linear-gradient(
				180deg,
				var(--color-poster-bg-0) 33%,
				var(--color-poster-bg-1) 66%
			);
			box-shadow: none;
		}

		.close {
			position: fixed;
			top: 0;
			right: 0;
			background-color: transparent;
			padding: 8px;
			color: rgba(255, 255, 255, 0.75);
			box-shadow: none;
			width: initial;
		}
	}
</style>
