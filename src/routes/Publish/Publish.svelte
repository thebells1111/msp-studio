<script>
	import parser from 'fast-xml-parser';
	import clone from 'just-clone';
	import { saveAs } from 'file-saver';
	import { v5 as uuidv5 } from 'uuid';

	import { selectedBand, selectedAlbum } from '$/stores';
	import ValueBlock from '../ValueBlock/ValueBlock.svelte';

	const NAMESPACE = 'c5b4d56b-fb34-4d62-bbc8-1ccbfaa50adf';

	function downloadFeed() {
		let js2xml = new parser.j2xParser({
			attributeNamePrefix: '@_',
			//attrNodeName: false,
			textNodeName: '#text',
			ignoreAttributes: false,
			ignoreNameSpace: false,
			format: true,
			indentBy: '  ',
			supressEmptyNode: true,
			attrValueProcessor: (val, attrName) => escapeAttr(`${val}`),
			tagValueProcessor: (val, tagName) => escapeTag(`${val}`)
		});
		console.log($selectedBand);
		console.log($selectedAlbum);

		let rss = {
			'@_version': '2.0',
			'@_xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
			'@_xmlns:podcast':
				'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md'
		};

		let channel = {
			generator: 'Music Side Project',
			title: $selectedAlbum.title,
			'itunes:author': $selectedBand.title,
			description: $selectedAlbum.description,
			'itunes:category': { '@_text': 'Music' },
			'itunes:keywords': 'music',
			'podcast:medium': 'music',
			'itunes:image': { '@_href': $selectedAlbum.artwork },
			'itunes:explicit': $selectedAlbum.explicit,
			link: 'add optional link',
			'itunes:owner': { '@_itunes:name': $selectedBand.title, '@_itunes:email': 'band@email.com' },
			'podcast:value': buildValue($selectedAlbum.value)
		};

		let items = $selectedAlbum.tracks.map((track, index) => {
			return {
				title: track.title,
				enclosure: { '@_url': track.url, '@_type': 'mp3', '@_length': 'add file size' },
				pubDate: 'add pubDate',
				description: track.description,
				'itunes:explicit': track.explicit,
				'itunes:duration': 'add duration',
				'itunes:image': { '@_href': track.artwork },
				'podcast:season': 1,
				'podcast:episode': index + 1,
				'podcast:value': buildValue(track.value),
				'itunes:duration': '00:03:53'
			};
		});

		channel.items = items;

		rss.channel = channel;

		let xmlJson = { rss: rss };

		console.log(xmlJson.rss.channel);

		let xml = js2xml.parse(xmlJson);
		console.log(xml);
	}

	const escapeAttr = (str) =>
		str.replace(
			/[&<>'"]/g,
			(tag) =>
				({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					"'": '&#39;',
					'"': '&quot;'
				}[tag])
		);

	const escapeTag = (str) => {
		if (str.match(/[&<>'"]/g)) {
			return '<![CDATA[' + str + ']]>';
		}
		return str;
	};

	async function saveFeed(title, xmlFile) {
		var blob = new Blob([xmlFile], { type: 'text/plain;charset=utf-8' });

		saveAs(blob, `${title} - ${d.replace(/\//g, '-').replace(',', '').replace(/:/g, '.')}.xml`);
	}

	function buildValue(tag) {
		let value = {
			'@_type': 'lightning',
			'@_method': 'keysend',
			'podcast:valueRecipient': tag.map((v) => {
				return {
					'@_name': v.name,
					'@_type': 'node',
					'@_address': v.address,
					'@_customKey': v.key,
					'@_customValue': v.value,
					'@_split': v.split
				};
			})
		};

		return value;
	}
</script>

<button class="download" on:click={downloadFeed}>Download Album</button>

<style>
	button.download {
		color: var(--color-text-0);
		background-color: blueviolet;
		padding: 8px 16px;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
	}
</style>
