<script>
	import { parse } from 'fast-xml-parser';
	import { decode } from 'html-entities';
	import localforage from 'localforage';
	const catalogDB = localforage.createInstance({
		name: 'catalogDB'
	});

	let feedUrl = 'https://www.sirtjthewrathful.com/wp-content/uploads/2023/07/Bloodshot-Lies.xml';
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
</script>

<div>
	<input bind:value={feedUrl} /> <button on:click={getFeed.bind(this, feedUrl)}>Find Feed</button>
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
</style>
