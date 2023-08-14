<script>
	import { parse } from 'fast-xml-parser';
	import { decode } from 'html-entities';
	import localforage from 'localforage';
	import { saveAs } from 'file-saver';
	const catalogDB = localforage.createInstance({
		name: 'catalogDB'
	});

	let feedUrl = '';
	let feedImported = false;
	let importing = false;
	let badUrl = false;

	async function getFeed(url) {
		try {
			badUrl = false;
			console.log(url);
			const response = await fetch('/api/proxy?q=' + encodeURIComponent(url));
			const feed = (await response.text()) || {};
			console.log(feed);
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
				importing = true;
				console.log(channel);
				const transformedData = transformPodcastData(channel);
				console.log(transformedData);
				let dbData = await catalogDB.getItem(channel['itunes:author']);
				if (!dbData) {
					dbData = { title: channel['itunes:author'], artwork: '', albums: [] };
				}

				dbData.albums = [].concat(dbData.albums);

				dbData.albums.push(transformedData);
				console.log(dbData);
				await catalogDB.setItem(channel['itunes:author'], dbData);
				importing = false;
				feedImported = true;
				setTimeout(() => {
					feedImported = false;
				}, 2000);
			} else {
				badUrl = true;
			}
		} catch (err) {
			badUrl = true;
			console.log('getFeeds Error:', err);
		}
	}

	function transformPodcastData(data) {
		// Function to transform individual track data
		function transformTrack(item) {
			return {
				title: item.title,
				artwork: item['itunes:image']['@_href'],
				url: item.enclosure['@_url'],
				value: item['podcast:value']['podcast:valueRecipient'].map((recipient) => ({
					name: recipient['@_name'],
					address: recipient['@_address'],
					key: recipient['@_customKey'],
					value: recipient['@_customValue'],
					split: recipient['@_split']
				})),
				description: data.description,
				explicit: item['itunes:explicit'],
				enclosure: {
					url: item.enclosure['@_url'],
					enclosureLength: item.enclosure['@_length'],
					type: item.enclosure['@_type']
				},
				guid: item.guid
			};
		}

		// If data.item is an array, map each item. If not, put the single item into an array and map it.
		const tracks = Array.isArray(data.item)
			? data.item.map(transformTrack)
			: [transformTrack(data.item)];

		return {
			title: data.title,
			artwork: data['itunes:image']['@_href'],
			tracks: tracks,
			value: data['podcast:value']['podcast:valueRecipient'].map((recipient) => ({
				name: recipient['@_name'],
				address: recipient['@_address'],
				key: recipient['@_customKey'],
				value: recipient['@_customValue'],
				split: recipient['@_split']
			})),
			description: data.description,
			explicit: data['itunes:explicit'],
			link: data.link, // No corresponding value in the input object
			enclosureUrl: data.enclosureUrl, // No corresponding value in the input object
			guid: data['podcast:guid']
		};
	}

	async function exportFeeds() {
		let jsonVariable = {};

		try {
			const keys = await catalogDB.keys();
			for (const key of keys) {
				const value = await catalogDB.getItem(key);
				jsonVariable[key] = value;
			}
		} catch (err) {
			console.log(err);
		}

		const blob = new Blob([JSON.stringify(jsonVariable)], {
			type: 'application/json;charset=utf-8'
		});
		saveAs(blob, 'catalog.json');
	}

	async function importFeeds(file) {
		const reader = new FileReader();
		reader.onload = async (event) => {
			const jsonVariable = JSON.parse(event.target.result);
			try {
				for (const [key, value] of Object.entries(jsonVariable)) {
					await catalogDB.setItem(key, value);
				}
				console.log('Data imported successfully.');
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

<div>
	<input bind:value={feedUrl} /> <button on:click={getFeed.bind(this, feedUrl)}>Find Feed</button>
</div>
<button on:click={exportFeeds}>Export Feeds</button>
<div
	id="dropBox"
	on:dragover={handleDragOver}
	on:dragleave={handleDragLeave}
	on:drop={handleDrop}
	class:dragOver
	style="width: 300px; height: 150px; border: 2px dashed #aaa; text-align: center; padding: 50px;"
>
	Drag & Drop your JSON file here
	<input type="file" hidden bind:files on:change={importFeeds} />
</div>

{#if feedImported}
	<h2>Feed Imported.</h2>
{/if}
{#if importing}
	<h2>Importing</h2>
{/if}
{#if badUrl}
	<h2>That Link doesn't return a feed.</h2>
{/if}

<style>
	div {
		width: 100%;
		display: flex;
	}
	input {
		width: 100%;
	}
	h2 {
		text-align: center;
	}

	.dragOver {
		border-color: #000;
	}
</style>
