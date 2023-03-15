<script>
	import parser from 'fast-xml-parser';
	import { saveAs } from 'file-saver';
	import { v5 as uuidv5 } from 'uuid';

	import { selectedBand, selectedAlbum } from '$/stores';

	const NAMESPACE = 'c5b4d56b-fb34-4d62-bbc8-1ccbfaa50adf';

	let errors = [];

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

		let rss = {
			'@_version': '2.0',
			'@_xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
			'@_xmlns:podcast':
				'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md'
		};

		let channel = {
			generator: 'Music Side Project',
			'itunes:category': { '@_text': 'Music' },
			'itunes:keywords': 'music',
			'podcast:medium': 'music'
		};

		if ($selectedBand.title) {
			channel['itunes:author'] = $selectedBand.title;
			channel['itunes:owner'] = { '@_itunes:name': $selectedBand.title, '@_itunes:email': '' };
		} else {
			errors.push('Band needs a name');
		}

		if ($selectedAlbum.title) {
			channel.title = $selectedAlbum.title;
		} else {
			errors.push('Album needs a name');
		}

		if ($selectedAlbum.description) {
			channel['description'] = $selectedAlbum.description;
		} else {
			errors.push('Album needs a description');
		}

		if ($selectedAlbum.artwork) {
			channel['itunes:image'] = { '@_href': $selectedAlbum.artwork };
		} else {
			errors.push('Album needs some artwork');
		}

		if ($selectedAlbum.explicit) {
			channel['itunes:explicit'] = $selectedAlbum.explicit;
		} else {
			errors.push('Is the album explicit?');
		}

		if ($selectedAlbum.link) {
			channel['link'] = $selectedAlbum.link;
		}
		if ($selectedAlbum.explicit) {
			channel['itunes:explicit'] = $selectedAlbum.explicit;
		} else {
			errors.push('Is the album explicit?');
		}

		if ($selectedAlbum.value) {
			channel['podcast:value'] = buildValue($selectedAlbum.value);
		} else {
			errors.push('Add some value to the album');
		}

		let items = $selectedAlbum.tracks.map((track, index) => {
			return {
				title: track.title,
				enclosure: {
					'@_url': track?.enclosure?.url,
					'@_type': track?.enclosure?.type,
					'@_length': track?.enclosure?.enclosureLength
				},
				pubDate:
					new Date(new Date().getTime() - 60000 * index).toUTCString().split(' GMT')[0] + ' +0000',
				description: track.description,
				'itunes:explicit': track.explicit,
				'itunes:duration': convertDurationToITunesFormat(track.duration),
				'itunes:image': { '@_href': track.artwork },
				'podcast:season': 1,
				'podcast:episode': index + 1,
				'podcast:value': buildValue(track.value)
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

	function convertDurationToITunesFormat(durationInSeconds) {
		// Convert duration to iTunes format (HH:MM:SS)
		const hours = Math.floor(durationInSeconds / 3600);
		const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
		const seconds = Math.floor(durationInSeconds - hours * 3600 - minutes * 60);
		const durationInITunesFormat = `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

		// Return duration in iTunes format
		return durationInITunesFormat;
	}
</script>

<button class="download" on:click={downloadFeed}>Download Album</button>

<style>
	button.download {
		color: var(--color-text-0);
		background-color: blueviolet;
		padding: 8px 16px;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
		display: block;
		margin: 16px 0 8px 16px;
		width: 203px;
	}
</style>
