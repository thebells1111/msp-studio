<script>
	import parser from 'fast-xml-parser';
	import { saveAs } from 'file-saver';
	import { v5 as uuidv5 } from 'uuid';

	import ErrorModal from './ErrorModal.svelte';

	import { selectedBand, selectedAlbum, catalogDB } from '$/stores';
	import PublishModal from './PublishModal.svelte';

	const NAMESPACE = 'c5b4d56b-fb34-4d62-bbc8-1ccbfaa50adf';

	let rssErrors = [];
	let showErrorModal = false;
	let showPublishModal = false;
	let xmlFile;

	function publishFeed() {
		rssErrors = [];
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
			generator: 'Music Side Project Studio',
			'itunes:category': { '@_text': 'Music' },
			'itunes:keywords': 'music',
			'podcast:medium': 'music'
		};

		if ($selectedBand.title) {
			channel['itunes:author'] = $selectedBand.title;
			channel['itunes:owner'] = { '@_itunes:name': $selectedBand.title, '@_itunes:email': '' };
		} else {
			rssErrors.push('Band needs a name');
		}

		if ($selectedAlbum.title) {
			channel.title = $selectedAlbum.title;
		} else {
			rssErrors.push('Album needs a name');
		}

		if ($selectedAlbum.description) {
			channel['description'] = $selectedAlbum.description;
		} else {
			rssErrors.push('Album needs a description');
		}

		if ($selectedAlbum.artwork) {
			channel['itunes:image'] = { '@_href': $selectedAlbum.artwork };
		} else {
			rssErrors.push('Album needs some artwork');
		}

		if ($selectedAlbum.explicit) {
			channel['itunes:explicit'] = $selectedAlbum.explicit;
		} else {
			rssErrors.push('Is the album explicit?');
		}

		if ($selectedAlbum.link) {
			console.log(isValidUrl($selectedAlbum.link));
			if (isValidUrl($selectedAlbum.link)) {
				channel['link'] = $selectedAlbum.link;
			} else {
				rssErrors.push('Link to Album Website is an invalid link');
			}
		}
		if ($selectedAlbum.explicit) {
			channel['itunes:explicit'] = $selectedAlbum.explicit;
		} else {
			rssErrors.push('Is the album explicit?');
		}

		if ($selectedAlbum.value) {
			channel['podcast:value'] = buildValue($selectedAlbum.value, 'Album');
		} else {
			rssErrors.push('Add some value to the album');
		}

		let items = $selectedAlbum.tracks.map((track, index) => {
			let title = track.title;
			let trackJSON = {
				pubDate:
					track.pubDate ||
					new Date(new Date().getTime() - 60000 * index).toUTCString().split(' GMT')[0] + ' +0000',
				'podcast:season': 1,
				'podcast:episode': index + 1
			};

			if (track.title) {
				trackJSON.title = track.title;
			} else {
				title = `Track ${index + 1}`;
				rssErrors.push(title + ' needs a name');
			}

			if (track?.enclosure?.url) {
				trackJSON.enclosure = {
					'@_url': track?.enclosure?.url,
					'@_type': track?.enclosure?.type,
					'@_length': track?.enclosure?.enclosureLength
				};

				trackJSON['itunes:duration'] = convertDurationToITunesFormat(track.duration);
			} else {
				rssErrors.push(title + ' needs a link to the mp3 file');
			}

			if (track.description) {
				trackJSON.description = track.description;
			}

			if (track.explicit) {
				trackJSON['itunes:explicit'] = track.explicit;
			}

			if (track.artwork) {
				trackJSON['itunes:image'] = { '@_href': track.artwork };
			}

			if (track.value) {
				trackJSON['podcast:value'] = buildValue(track.value, title);
			}

			return trackJSON;
		});

		channel.item = [...items];

		rss.channel = channel;

		let xmlJson = { rss: rss };

		xmlFile = js2xml.parse(xmlJson);
		if (rssErrors.length) {
			showErrorModal = true;
		} else {
			$catalogDB.setItem($selectedBand.title, $selectedBand);
			showPublishModal = true;
		}
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

	function buildValue(tag, name) {
		let splitTotal = tag.reduce((t, v) => {
			return t + Number(v.split);
		}, 0);

		if (splitTotal !== 100) {
			rssErrors.push(
				`The splits for ${
					name === 'Album' ? 'the "Album"' : `track "${name}"`
				} don't add up to 100%`
			);
		}
		let value = {
			'@_type': 'lightning',
			'@_method': 'keysend',
			'podcast:valueRecipient': tag.map((v, i) => {
				let rec = { '@_type': 'node' };
				let person = v.name;
				if (v.name) {
					rec['@_name'] = v.name;
				} else {
					person = `Recepient #${i + 1}`;
					rssErrors.push(`"${person}" in the "${name}" value tag block needs a name`);
				}
				if (v.address) {
					rec['@_address'] = v.address;
				} else {
					rssErrors.push(
						`Person "${person}" in the "${name}" value tag block needs an lightning address`
					);
				}

				if (v.key) {
					rec['@_customKey'] = v.key;
				}
				if (v.value) {
					rec['@_customValue'] = v.value;
				}
				if (Number(v.split)) {
					rec['@_split'] = v.split;
				} else {
					rssErrors.push(`Person "${person}" in the "${name}" value tag block needs a split`);
				}
				return rec;
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
	function isValidUrl(url) {
		// Create a regular expression pattern that matches valid URLs with http, https, or ftp protocols
		const urlPattern =
			/^(http|https|ftp):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;

		// Test whether the provided URL matches the pattern
		return urlPattern.test(url);
	}
</script>

<button class="publish" on:click={publishFeed}>Publish Album</button>

{#if showErrorModal}
	<ErrorModal {rssErrors} bind:showErrorModal />
{/if}

{#if showPublishModal}
	<PublishModal {xmlFile} bind:showPublishModal />
{/if}

<style>
	button.publish {
		color: var(--color-text-0);
		background-color: blueviolet;
		padding: 8px 16px;
		box-shadow: 0 2px 5px 2px var(--color-button-shadow);
		display: block;
		margin: 16px 0 8px 16px;
		width: 203px;
	}
</style>
