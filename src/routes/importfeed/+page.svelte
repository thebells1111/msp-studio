<script>
	import { parse } from 'fast-xml-parser';
	import { decode } from 'html-entities';
	import localforage from 'localforage';

	const feedDB = localforage.createInstance({
		name: 'feedDB'
	});
	let feedUrl = '';
	let statusText = 'Upload a feed or paste your link above.';

	async function getFeed({ feedUrl, feedFile }) {
		try {
			statusText = '';
			let feed = {};
			if (feedUrl) {
				const response = await fetch('/api/proxy?q=' + encodeURIComponent(feedUrl));
				feed = (await response.text()) || {};
			} else if (feedFile) {
				feed = feedFile;
			} else {
				return;
			}
			const parserOptions = {
				attributeNamePrefix: '@_',
				ignoreAttributes: false,
				ignoreNameSpace: false,
				attrValueProcessor: (val, attrName) => decode(val),
				tagValueProcessor: (val, tagName) => decode(val)
			};
			let xmlJson = parse(feed, parserOptions);
			let channel = xmlJson.rss.channel;
			if (channel) {
				statusText = 'Importing Feed';
				if (feedUrl) {
					channel.enclosureUrl = feedUrl;
				}

				if (channel.item) {
					channel.item = [].concat(channel.item);
				}
				console.log();
				if (!channel?.['podcast:guid']) {
					statusText =
						"Your feed doesn't have a podcast guid and wasn't saved. Auto guid creation is being added to a future version of MSP";
					return;
				} else {
					await feedDB.setItem(channel['podcast:guid'], channel);
				}

				console.log(channel);
				console.log(channel?.['podcast:guid']);

				//
				statusText = 'Feed Imported';
				setTimeout(() => {
					statusText = 'Upload a feed or paste your link above.';
				}, 2000);
			} else {
				statusText = 'Upload a feed or paste your link above.';
			}
		} catch (err) {
			statusText = "That Link doesn't return a feed.";
			console.log('getFeeds Error:', err);
		}
	}

	async function importFeeds(file) {
		const reader = new FileReader();
		reader.onload = async (event) => {
			try {
				getFeed({ feedFile: event.target.result });
			} catch (err) {
				console.log(err);
			}
		};
		reader.readAsText(file);
	}

	function handleDrop(event) {
		event.preventDefault();
		dragOver = false;
		const file = event.dataTransfer.files[0]; // Correctly retrieve the dropped file
		importFeeds(file);
	}

	let dragOver = false;

	function handleDragOver(event) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	let files;
</script>

<main>
	<find-feed>
		<input bind:value={feedUrl} placeholder="paste your feed link here" />
		<button on:click={getFeed.bind(this, { feedUrl })}>Find Feed</button>
	</find-feed>
	<drop-box
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		class:dragOver
	>
		<h2>{statusText}</h2>
		<input type="file" hidden bind:files on:change={importFeeds} />
	</drop-box>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	find-feed {
		display: flex;
		width: calc(100% - 16px);
		margin: 8px;
	}
	input {
		flex: 1;
		margin-right: 8px;
	}

	.export {
		width: 50%;
	}

	drop-box {
		width: calc(100% - 64px);
		height: 50%;
		border: 2px dashed #aaa;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 8px;
	}
	h2 {
		text-align: center;
	}

	.dragOver {
		border-color: #000;
	}
</style>
