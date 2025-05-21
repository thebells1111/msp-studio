<script>
	import parser from 'fast-xml-parser';
	import { v4 as uuidv4 } from 'uuid';
	import clone from 'just-clone';
	import normalizeSplits from './functions/normalizeSplits.js';
	import createChannel from './functions/createChannel.js';
	import rss2nostr from './functions/rss2nostr.js';

	import PublishModal from './PublishModal.svelte';
	import ErrorModal from './ErrorModal.svelte';

	import { editingFeed } from '$/stores';

	let showErrorModal = false;
	let showPublishModal = false;
	let xmlFile;
	let rssErrors = [];

	async function publishFeed() {
		rssErrors = [];
		let rss = {
			'@_version': '2.0',
			'@_endcoding': 'UTF-8',
			'@_xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
			'@_xmlns:podcast':
				'https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md',
			'@_xmlns:media': 'http://search.yahoo.com/mrss/'
		};

		let { feed, errors } = await createChannel({ feed: clone($editingFeed), errors: rssErrors });

		rssErrors = errors;

		console.log(feed);

		let uniqueTrackGuids = new Set();

		feed.item.forEach((track, index) => {
			(track.pubDate =
				track.pubDate ||
				new Date(new Date().getTime() - 60000 * index).toUTCString().split(' GMT')[0] + ' +0000'),
				(track['podcast:season'] = 1),
				(track['podcast:episode'] = index + 1);

			if (!(track?.guid?.['#text'] || track?.guid)) {
				const guid = generateTrackGuid();
				uniqueTrackGuids.add(guid);
				track.guid = { ['@_isPermaLink']: 'false', ['#text']: guid };
			} else {
				uniqueTrackGuids.add(track.guid?.['#text'] || track.guid);
				if (!track.guid?.['!_isPermakLink']) {
					track.guid = {
						['@_isPermaLink']: 'false',
						['#text']: track.guid?.['#text'] || track.guid
					};
				}
			}

			let title = track.title;

			if (!track.title) {
				title = `Track ${index + 1}`;
				rssErrors.push(title + ' needs a name');
			}

			if (track?.enclosure?.['@_url']) {
				track['itunes:duration'] = convertDurationToITunesFormat(track['itunes:duration']);
			} else {
				rssErrors.push(title + ' needs a link to the mp3 file');
			}

			if (track?.['podcast:value']?.['podcast:valueRecipient']?.length) {
				track['podcast:value']['podcast:valueRecipient'] = normalizeSplits(
					track['podcast:value']['podcast:valueRecipient'],
					title,
					rssErrors
				);

				//this is to copy the updated splits to the editing feed
				//since "feed" may have things deleted prior to creating the xml file
				$editingFeed.item[index]['podcast:value']['podcast:valueRecipient'] = clone(
					track['podcast:value']['podcast:valueRecipient']
				);
			} else {
				delete track['podcast:value'];
			}
			if (track?.['podcast:chapters']?.['@_url']) {
				track['podcast:chapters'] = {
					'@_url': track['podcast:chapters']['@_url'],
					'@_type': 'application/json'
				};
			} else {
				delete track['podcast:chapters'];
			}

			if (track?.['podcast:transcript']?.['@_url']) {
				track['podcast:transcript'] = [
					{
						'@_url': track['podcast:transcript']['@_url'],
						'@_type': 'application/srt'
					}
				];
			} else {
				delete track['podcast:transcript'];
			}

			if (!track?.description) {
				delete track.description;
			}

			if (!track?.['itunes:image']?.['@_href']) {
				delete track['itunes:image'];
			}

			track['podcast:aspectImages'] = []
				.concat(track['podcast:aspectImages'])
				.filter((v) => v?.['@_src']);
			if (!track?.['podcast:aspectImages']?.length) {
				delete track['podcast:aspectImages'];
			}

			delete track.explicit;
		});

		console.log(feed);

		rss.channel = feed;

		let xmlJson = { rss: rss };
		console.log(xmlJson);

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

		xmlFile = js2xml.parse(xmlJson);
		if (rssErrors.length) {
			showErrorModal = true;
		} else {
			// showPublishModal = true;
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

		console.log(rss2nostr(feed));
	}
</script>

<button on:click={publishFeed}>Publish Album</button>

{#if showErrorModal}
	<ErrorModal {rssErrors} bind:showErrorModal />
{/if}

{#if showPublishModal}
	<PublishModal {xmlFile} bind:showPublishModal />
{/if}

<style>
	button {
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
