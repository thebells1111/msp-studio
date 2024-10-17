<script>
	import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
	import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';

	// import PublishModal from './PublishModal.svelte';
	// import ErrorModal from './ErrorModal.svelte';

	import { editingFeed, catalogDB } from '$/stores';

	const NAMESPACE = 'c5b4d56b-fb34-4d62-bbc8-1ccbfaa50adf';

	let rssErrors = [];
	let showErrorModal = false;
	let showPublishModal = false;
	let xmlFile;

	async function publishFeed() {
		const parser = new XMLParser();
		rssErrors = [];
		const xmlOptions = {
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
		};

		let rss = {
			'@_version': '2.0',
			'@_endcoding': 'UTF-8',
			'@_xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
			'@_xmlns:podcast':
				'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md',
			'@_xmlns:media': 'http://search.yahoo.com/mrss/'
		};

		let channel = {
			generator: 'Music Side Project Studio',
			'itunes:category': { '@_text': 'Music' },
			'itunes:keywords': 'music',
			'podcast:medium': 'music'
		};

		if ($editingFeed?.['itunes:author']) {
			if (!$editingFeed['itunes:owner']) {
				$editingFeed['itunes:owner'] = {
					'@_itunes:name': $editingFeed['itunes:author'],
					'@_itunes:email': ''
				};
			}
		} else {
			rssErrors.push('Band needs a name');
		}

		if (!$editingFeed.title) {
			rssErrors.push('Album needs a name');
		}

		if (!$editingFeed.description) {
			rssErrors.push('Album needs a description');
		}

		if (!$editingFeed?.['itunes:image']?.['@_href']) {
			rssErrors.push('Album needs some artwork');
		}

		if (!$editingFeed?.explicit) {
			rssErrors.push('Is the album explicit?');
		}

		if (!isValidUrl($editingFeed?.link)) {
			rssErrors.push('Link to Album Website is an invalid link');
		}

		if ($editingFeed?.['itunes:explicit']) {
			rssErrors.push('Is the album explicit?');
		}

		if (
			$editingFeed?.['podcast:value']?.['podcast:valueRecipient']?.some((v) => v?.['@_address'])
		) {
			$editingFeed['podcast:value']['podcast:valueRecipient'] = normalizeSplits(
				$editingFeed['podcast:value']['podcast:valueRecipient'],
				'Album'
			);
		} else {
			rssErrors.push('Add some value to the album');
		}

		if ($editingFeed?.['podcast:guid']) {
			$editingFeed['podcast:guid'] = await checkPodcastGuid($editingFeed['podcast:guid']);
		} else {
			$editingFeed['podcast:guid'] = await createNewPodcastGuid();
		}

		let uniqueTrackGuids = new Set();

		let items = $editingFeed.item.map((track, index) => {
			let trackJSON = {
				pubDate:
					track.pubDate ||
					new Date(new Date().getTime() - 60000 * index).toUTCString().split(' GMT')[0] + ' +0000',
				'podcast:season': 1,
				'podcast:episode': index + 1
			};

			if (!(track?.guid?.['#text'] || track?.guid)) {
				const guid = generateTrackGuid();
				uniqueTrackGuids.add(guid);
				trackJSON.guid = { ['@_isPermaLink']: 'false', ['#text']: guid };
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

			if (track?.enclosure?.['@_url']) {
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

			if (track?.['itunes:explicit']) {
				trackJSON['itunes:explicit'] = track.explicit;
			}

			if (track?.['itunes:image']?.['@_href']) {
				trackJSON['itunes:image'] = { '@_href': track['itunes:image']['@_href'] };
			}

			if (track?.['podcast:value']?.['podcast:valueRecipient']) {
				trackJSON['podcast:value']['podcast:valueRecipient'] = normalizeSplits(
					track['podcast:value']['podcast:valueRecipient'],
					title
				);
			}

			if (track?.['podcast:chapters']?.['@_url']) {
				trackJSON['podcast:chapters'] = {
					'@_url': track['podcast:chapters']['@_url'],
					'@_type': 'application/json'
				};
			}

			if (track?.['podcast:transcript']?.['@_url']) {
				trackJSON['podcast:transcript'] = [
					{
						'@_url': track['podcast:transcript']['@_url'],
						'@_type': 'application/srt'
					}
				];
			}

			return trackJSON;
		});

		$editingFeed.item = [...items];

		console.log($editingFeed);

		// 	rss.channel = channel;

		// 	let xmlJson = { rss: rss };

		// 	xmlFile = js2xml.parse(xmlJson);
		// 	console.log(xmlJson);
		// 	if (rssErrors.length) {
		// 		showErrorModal = true;
		// 	} else {
		// 		$catalogDB.setItem($selectedBand.title, $selectedBand);
		// 		showPublishModal = true;
		// 	}

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

		// console.log($selectedAlbum);
		// $catalogDB.setItem($selectedBand.title, $selectedBand);

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

		function normalizeSplits(arr, name) {
			// Helper function to normalize individual splits
			function normalize(splits) {
				// Convert strings to numbers
				let rounded = splits.map((num) => parseFloat(num));

				// Find the factor to scale up the splits
				let scale = Math.pow(
					10,
					Math.max(
						...rounded.map((num) => {
							let decimals = (num.toString().split('.')[1] || '').length;
							return decimals;
						})
					)
				);

				// Scale all splits by the found factor
				let scaled = rounded.map((num) => Math.round(num * scale));

				return scaled;
			}

			// Extract all '@_split' values from the array
			const splits = arr.map((obj) => parseFloat(obj['@_split']));

			// Normalize the extracted splits
			const normalizedSplits = normalize(splits);

			// Update the original array with the normalized splits
			return arr.map((v, i) => {
				const person = `Recepient #${i + 1}`;
				if (!v?.['@_name']) {
					rssErrors.push(`"${person}" in the "${name}" value tag block needs a name`);
				}
				if (!v?.['@_address']) {
					rssErrors.push(
						`Person "${person}" in the "${name}" value tag block needs an lightning address`
					);
				}

				if (!Number(v?.['@_split'])) {
					rssErrors.push(`Person "${person}" in the "${name}" value tag block needs a split`);
				}
				return {
					...v,
					'@_split': normalizedSplits[i].toString() // Convert back to string
				};
			});
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
		console.log(rssErrors);
	}
</script>

<button class="publish" on:click={publishFeed}>Publish Album</button>

<!-- {#if showErrorModal}
	<ErrorModal {rssErrors} bind:showErrorModal />
{/if}

{#if showPublishModal}
	<PublishModal {xmlFile} bind:showPublishModal />
{/if} -->

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
