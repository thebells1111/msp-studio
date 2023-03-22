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

	let feedUrl;

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
	}

	async function podping() {
		let url = `api/podping?url=${encodeURIComponent(feedUrl)}&reason=update&medium=music`;

		console.log(url);

		const res = await fetch(url);
		const data = await res.text();
		console.log(data);
	}
</script>

<blurred-background on:mousedown|self={closeModal} on:touchend|self={closeModal}>
	<modal>
		<button class="close" on:click={closeModal}>
			<Close size="24" />
		</button>
		<button on:click={saveFeed.bind(this, $selectedAlbum.title, xmlFile)}> Download Feed </button>
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

		<button on:click={podping}>Add to Directory</button>
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
		width: calc(100% - 84px);
	}

	upload {
		display: inline-flex;
		position: relative;
		height: 12px;
		width: 12px;
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
</style>
