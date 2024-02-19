<script>
	import { deserialize } from '$app/forms';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Close from '../icons/Close.svelte';
	import { copyText } from 'svelte-copy';
	import { remoteServer, editingFeed } from '$/stores';

	export let showXMLModal = false;

	let feedUrl = '';

	export let feed;
	export let xmlFile;
	let filePath;
	let displayText;
	let showAdd = false;

	export let onClose = () => {};

	function closeModal() {
		onClose();
		showXMLModal = false;
	}

	onMount(() => {
		if (xmlFile) {
			const file = createFileFromString(xmlFile, 'feed.xml', 'text/xml');
			uploadFile(file);
		}
	});

	function createFileFromString(str, fileName, mimeType) {
		return new File([new Blob([str], { type: mimeType })], fileName, { type: mimeType });
	}
	async function uploadFile(file) {
		let fileType = '';
		let fileName = 'feed';
		let folderName = '';

		const data = new FormData();
		data.append('file', file);

		const baseUrl = remoteServer ? remoteServer + '/api/upload' : '/api/upload';
		const queryParams = new URLSearchParams({
			fileName: fileName,
			folderName: feed['podcast:guid'],
			fileType: fileType
		}).toString();

		const fullUrl = `${baseUrl}?${queryParams}`;

		const response = await fetch(fullUrl, {
			method: 'POST',
			body: data
		});
		const result = await response.json();

		filePath = $page.url.origin + result.path;

		checkPodcastIndex();
	}

	async function checkPodcastIndex() {
		let guidUrl =
			remoteServer +
			`/api/queryindex?q=podcasts/byguid?guid=${encodeURIComponent(feed['podcast:guid'])}`;

		const guidRes = await fetch(guidUrl);
		const guidData = await guidRes.json();

		if (guidData.status === 'true' && guidData.feed?.url) {
			podping(guidData.feed.url);
		} else {
			showAdd = true;
		}
	}

	async function podping(feedUrl) {
		let url =
			remoteServer + `/api/podping?url=${encodeURIComponent(feedUrl)}&reason=update&medium=music`;

		const res = await fetch(url);
		const data = await res.text();
		if (data === 'Success!') {
			displayText =
				'Feed successfully updated. Please wait a few minutes for your changes to appear in the apps.';
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
		{#if filePath}
			<adder>
				<input type="text" value={filePath} readonly />
				<button
					on:click={(e) => {
						e.target.innerText = 'Copied!';
						setTimeout(() => (e.target.innerText = 'Copy to paste into Podcast Index'), 500);
						copyText(filePath);
					}}
				>
					{showAdd ? 'Copy to paste into Podcast Index' : 'Copy Feed Address'}
				</button>

				{#if showAdd}
					<iframe src="https://podcastindex.org/add" />
				{:else if displayText}
					<p>{displayText}</p>
				{/if}
			</adder>
		{/if}
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

	iframe {
		flex: 1;
		width: 100%;
		height: calc(100% - 102px);
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

	input {
		width: calc(100% - 24px);
	}

	button {
		box-shadow: 0 3px 5px 0px var(--color-button-shadow);
		max-width: 320px;
		width: calc(100% - 16px);
		margin: 8px auto;
	}

	adder {
		margin-top: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: calc(100% - 40px);
	}

	input {
		max-width: 600px;
		text-align: center;
	}

	a {
		color: var(--color-bg-add-album);
		font-weight: 550;
	}

	p {
		font-size: 1.1em;
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
