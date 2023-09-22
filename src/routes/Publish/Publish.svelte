<script>
	import parser from 'fast-xml-parser';
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';

	import ErrorModal from './ErrorModal.svelte';

	import { selectedBand, selectedAlbum, catalogDB } from '$/stores';
	import PublishModal from './PublishModal.svelte';

	const NAMESPACE = 'c5b4d56b-fb34-4d62-bbc8-1ccbfaa50adf';

	let rssErrors = [];
	let showErrorModal = false;
	let showPublishModal = false;
	let xmlFile;

	async function publishFeed() {
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

		let podcastGuid = $selectedAlbum?.guid;
		if (podcastGuid) {
			podcastGuid = await checkPodcastGuid(podcastGuid);
		} else {
			podcastGuid = await createNewPodcastGuid();
		}

		$selectedAlbum.guid = podcastGuid;
		channel['podcast:guid'] = podcastGuid;

		let uniqueTrackGuids = new Set();

		let items = $selectedAlbum.tracks.map((track, index) => {
			let trackJSON = {
				pubDate:
					track.pubDate ||
					new Date(new Date().getTime() - 60000 * index).toUTCString().split(' GMT')[0] + ' +0000',
				'podcast:season': 1,
				'podcast:episode': index + 1
			};

			if (!track.guid) {
				track.guid = generateTrackGuid();
				uniqueTrackGuids.add(track.guid);
				trackJSON.guid = { ['@_isPermaLink']: 'false', ['#text']: track.guid };
				$selectedAlbum.tracks[index].guid = trackJSON.guid;
			} else {
				uniqueTrackGuids.add(track.guid?.['#text'] || track.guid);
				if (!track.guid?.['!_isPermakLink']) {
					track.guid = {
						['@_isPermaLink']: 'false',
						['#text']: track.guid?.['#text'] || track.guid
					};
				}
				trackJSON.guid = track.guid;
			}

			let title = track.title;

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

			if (track.chapters) {
				trackJSON['podcast:chapters'] = { '@_url': track.chapters, '@_type': 'application/json' };
			}

			if (track.transcripts) {
				trackJSON['podcast:transcript'] = [
					{
						'@_url': track.transcripts,
						'@_type': 'application/srt'
					}
				];
			}

			return trackJSON;
		});

		channel.item = [...items];

		rss.channel = channel;

		let xmlJson = { rss: rss };

		xmlFile = js2xml.parse(xmlJson);
		console.log(xmlJson);
		if (rssErrors.length) {
			showErrorModal = true;
		} else {
			$catalogDB.setItem($selectedBand.title, $selectedBand);
			showPublishModal = true;
		}

		async function checkPodcastGuid(guid) {
			let isValidGuid = checkValidGuid(guid);

			if (!isValidGuid) {
				return await createNewPodcastGuid();
			} else {
				return guid;
			}
		}

		async function createNewPodcastGuid() {
			let guid = await generateValidGuid();
			return guid;
		}

		function checkValidGuid(input) {
			const regex = new RegExp(
				'^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$'
			);
			return regex.test(input);
		}

		async function generateValidGuid() {
			const namespace = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
			const inputString = uuidv4();
			const uniqueId = uuidv5(inputString, namespace);
			let url = `/api/queryindex?q=${encodeURIComponent(`podcasts/byguid?guid=${uniqueId}`)}`;

			const res = await fetch(url);
			const data = await res.json();
			if (data?.feed?.length) {
				return generateValidGuid();
			} else {
				return uniqueId;
			}
		}

		function generateTrackGuid() {
			let trackGuid;
			do {
				trackGuid = generateGuid();
			} while (!isBlockGuidUnique(trackGuid));
			return trackGuid;
		}

		function generateGuid() {
			let uniqueId = uuidv4();
			return uniqueId;
		}

		function isBlockGuidUnique(trackGuid) {
			if (uniqueTrackGuids.has(trackGuid)) {
				return false;
			}

			return true;
		}

		console.log($selectedAlbum);
		$catalogDB.setItem($selectedBand.title, $selectedBand);
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
		margin: 16px auto 8px auto;
		max-width: 600px;
		width: calc(100% - 16px);
	}
</style>
