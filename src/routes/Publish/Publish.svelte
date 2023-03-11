<script>
	import parser from 'fast-xml-parser';
	import clone from 'just-clone';
	import { saveAs } from 'file-saver';

	import { selectedBand, selectedAlbum } from '$/stores';

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
			'itunes:category': { '@_text': 'Music' },
			'itunes:keywords': 'music',
			'podcast:guid': 'setup guid',
			'podcast:medium': 'music',
			'itunes:image': { '@_href': $selectedAlbum.artwork }
		};

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
