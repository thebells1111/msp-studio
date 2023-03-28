<script>
	import Close from '../icons/Close.svelte';
	import UploadFile from '../icons/UploadFile.svelte';

	import {
		selectedAlbum,
		currentModal,
		uploadCB,
		uploadFileType,
		uploadFileText,
		user,
		feedFile
	} from '$/stores';

	export let showPublishModal = false;
	export let xmlFile;

	let feedUrl =
		'https://truefansmusic.com/wp-content/uploads/2023/03/The-Bible-Song-Sing-Along.xml';

	let displayText = `${
		$user.wpCreds ? 'Upload your feed to WordPress <br/>or<br/>' : ''
	}Download your feed to host somewhere else,</br>then enter the link to your feed.<br/><br/>Once that's done, publish your feed to the directory.`;

	function closeModal() {
		showPublishModal = false;
	}

	async function saveFeed(title, xmlFile) {
		var blob = new Blob([xmlFile], { type: 'text/plain;charset=utf-8' });
		let date = new Date();
		let d = date.toLocaleString('en-US', { hour12: false });

		saveAs(blob, `${title} - ${d.replace(/\//g, '-').replace(',', '').replace(/:/g, '.')}.xml`);
	}

	function setFeed(url) {
		feedUrl = url;
		displayText = 'Feed Successfully Uploaded to WordPress';
	}

	async function checkPodcastIndex() {
		let feed = `api/queryindex?q=podcasts/byfeedurl?url=${encodeURIComponent(feedUrl)}`;

		const res = await fetch(feed);
		let data = await res.json();
		let err;

		addFeed();
		console.log(data);

		// if (data.status === 'true') {
		// 	podping();
		// } else if (data.status === 'false') {
		// 	addFeed();
		// }
	}

	async function podping() {
		let url = `api/podping?url=${encodeURIComponent(feedUrl)}&reason=update&medium=music`;

		console.log(url);

		const res = await fetch(url);
		const data = await res.text();
		console.log(data);
		if (data === 'Success!') {
			displayText =
				'Feed successfully added to directory. Please wait a few minutes for your changes to appear in the player.';
		} else {
			displayText = data;
		}
	}

	async function addFeed() {
		let feed = `api/queryindex?q=add/byfeedurl?url=${encodeURIComponent(feedUrl)}`;

		const res = await fetch(feed);
		const data = await res.json();
		console.log(data);
		displayText = data.description;
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<modal>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>

		<link-container>
			<label>
				<h4>Link to Feed (required)</h4>
				<input class:uploadable={$user.wpCreds} bind:value={feedUrl} />
			</label>
			{#if $user.wpCreds}
				<upload>
					<button
						on:click={() => {
							$currentModal = 'fileUploader';
							$uploadCB = setFeed;
							$uploadFileType = 'feed';
							$uploadFileText = 'Upload Feed';
							$feedFile = xmlFile;
						}}
					>
						<UploadFile size="24" />
						upload<br />feed
					</button>
				</upload>
			{/if}
		</link-container>

		<button-container>
			{#if feedUrl?.endsWith('.xml')}
				<button class="directory" on:click={checkPodcastIndex}>Add to Directory</button>
			{:else}
				<spacer />
			{/if}
			<button class="download" on:click={saveFeed.bind(this, $selectedAlbum.title, xmlFile)}>
				Download Feed
			</button>
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
		width: 100%;
		height: 100%;
		position: absolute;
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
		position: absolute;
		top: 0;
		right: 0;
		background-color: transparent;
		padding: 8px;
		color: rgba(255, 255, 255, 0.75);
		box-shadow: none;
	}
	link-container {
		display: block;
		margin: 64px 0 48px 0;
		display: relative;
		width: 100%;
	}

	h4 {
		padding: 0;
		margin: 0;
	}

	input {
		width: calc(100% - 16px);
		margin: 0 8px;
	}

	.uploadable {
		margin: 0 8px;
		width: calc(100% - 92px);
	}

	upload {
		display: inline-flex;
		position: relative;
		height: 12px;
		width: 12px;
	}

	button {
		box-shadow: 0 3px 5px 0px var(--color-button-shadow);
	}

	upload button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 0.7em;
		padding: 0;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		position: absolute;
		top: -25px;
		right: -50px;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
	}

	.directory {
		background-color: var(--color-bg-add-directory);
	}

	.download {
		background-color: var(--color-bg-download-feed);
	}

	button-container {
		display: flex;
		justify-content: space-between;
		padding: 0 16px;
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
</style>
