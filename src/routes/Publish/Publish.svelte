<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import parser from 'fast-xml-parser';
	import { v4 as uuidv4 } from 'uuid';

	import ErrorModal from './ErrorModal.svelte';
	import PublishModal from './PublishModal.svelte';
	import ShowXmlPathModal from './ShowXMLPathModal.svelte';

	import { feeds } from '$/stores';

	let rssErrors = [];
	let showErrorModal = false;
	let showPublishModal = false;
	let showXMLModal = false;
	let xmlFile;
	export let feed;
	export let onClose = () => {};

	onMount(publishFeed);

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

		if (!feed['itunes:author']) {
			rssErrors.push('Band needs a name');
		}

		if (!feed.title) {
			rssErrors.push('Album needs a name');
		}

		if (!feed.description) {
			rssErrors.push('Album needs a description');
		}

		if (!feed['itunes:image']['@_href']) {
			rssErrors.push('Album needs some artwork');
		} else if (!feed['itunes:image']['@_href'].includes($page.url.origin)) {
			feed['itunes:image']['@_href'] = $page.url.origin + feed['itunes:image']['@_href'];
		}

		if (!feed['itunes:explicit']) {
			rssErrors.push('Is the album explicit?');
		}

		if (!feed.link && !isValidUrl(feed.link)) {
			rssErrors.push(
				`Link to Album Website is an invalid link <br/> Use https://musicsideproject.com/ if you don't have your own site.`
			);
		}

		if (feed['podcast:value']) {
			buildValue(feed['podcast:value']['podcast:valueRecipient'], 'Album');
		} else {
			rssErrors.push('Add some value to the album');
		}

		let uniqueTrackGuids = new Set();

		feed.item.forEach((track, index) => {
			(track.pubDate =
				track.pubDate ||
				new Date(new Date().getTime() - 60000 * index).toUTCString().split(' GMT')[0] + ' +0000'),
				(track['podcast:season'] = 1),
				(track['podcast:episode'] = index + 1);

			if (!track?.guid?.['#text']) {
				console.log('no text');
				let guid = generateTrackGuid();
				uniqueTrackGuids.add(guid);
				track.guid = { '@_isPermaLink': 'false', '#text': track.guid };
			} else {
				uniqueTrackGuids.add(track.guid?.['#text'] || track.guid);
				if (!track.guid?.['@_isPermakLink']) {
					track.guid = {
						['@_isPermaLink']: 'false',
						['#text']: track.guid?.['#text'] || track.guid
					};
				}
			}

			let title = track?.title;
			if (!track?.title) {
				title = `Track ${index + 1}`;
				rssErrors.push(title + ' needs a name');
			}

			if (!track?.enclosure?.['@_url']) {
				rssErrors.push(title + ' needs a link to the mp3 file');
			} else if (!track.enclosure['@_url'].includes($page.url.origin)) {
				track.enclosure['@_url'] = $page.url.origin + track.enclosure['@_url'];
				track['itunes:duration'] = convertDurationToITunesFormat(track.duration);
			}

			if (track['podcast:value']) {
				buildValue(track['podcast:value']['podcast:valueRecipient'], track.title);
			}

			if (!track?.['itunes:image']?.['@_href']) {
				delete track['itunes:image'];
			} else if (!track?.['itunes:image']?.['@_href'].includes($page.url.origin)) {
				track['itunes:image']['@_href'] = $page.url.origin + track['itunes:image']['@_href'];
			}

			if (!track?.['podcast:chapters']?.['@_url']) {
				delete track['podcast:chapters'];
			} else if (!track?.['podcast:chapters']?.['@_url'].includes($page.url.origin)) {
				track['podcast:chapters']['@_url'] = $page.url.origin + track['podcast:chapters']['@_url'];
			}

			if (!track?.['podcast:transcript']?.['@_url']) {
				delete track['podcast:transcript'];
			} else if (!track?.['podcast:transcript']?.['@_url'].includes($page.url.origin)) {
				track['podcast:transcript']['@_url'] =
					$page.url.origin + track['podcast:transcript']['@_url'];
			}
		});

		rss.channel = feed;

		let xmlJson = { rss: rss };

		xmlFile = js2xml.parse(xmlJson);
		console.log(xmlJson.rss.channel.item[0]);

		if (rssErrors.length) {
			showErrorModal = true;
		} else {
			$feeds[feed['podcast:guid']] = feed;
			showXMLModal = true;
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
		console.log(tag);
		let splitTotal = tag.reduce((t, v) => {
			return t + Number(v['@_split']);
		}, 0);

		console.log(splitTotal);

		if (splitTotal !== 100) {
			rssErrors.push(
				`The splits for ${
					name === 'Album' ? 'the "Album"' : `track "${name}"`
				} don't add up to 100%`
			);
		}
		tag.forEach((v, i) => {
			let person = v['@_name'];
			if (!v['@_name']) {
				person = `Recepient #${i + 1}`;
				rssErrors.push(`"${person}" in the "${name}" value tag block needs a name`);
			}
			if (!v['@_address']) {
				rssErrors.push(
					`Person "${person}" in the "${name}" value tag block needs an lightning address`
				);
			}
			if (!Number(v['@_split'])) {
				rssErrors.push(`Person "${person}" in the "${name}" value tag block needs a split`);
			}
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
</script>

{#if showErrorModal}
	<ErrorModal {rssErrors} {onClose} bind:showErrorModal />
{/if}

{#if showPublishModal}
	<PublishModal {xmlFile} {feed} {onClose} bind:showPublishModal />
{/if}

{#if showXMLModal}
	<ShowXmlPathModal {xmlFile} {feed} {onClose} bind:showXMLModal />
{/if}
