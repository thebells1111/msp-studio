export default function rss2nostr(feed, feedUrl = null) {
	const channelGuid = extractText(feed['podcast:guid']);
	const items = Array.isArray(feed.item) ? feed.item : [feed.item];

	const channelTags = clean([
		['d', channelGuid],
		['title', extractText(feed.title)],
		['summary', extractText(feed.description)],
		['image', feed['itunes:image']?.['@_href']],
		['author', extractText(feed['itunes:author'])],
		['explicit', extractText(feed['itunes:explicit'])?.toLowerCase()],
		['i', `podcast:guid: ${channelGuid}`],
		feedUrl ? ['i', `url: ${feedUrl}`] : null,
		...parseSplits(feed['podcast:value']),
		...items.map((item) => ['ref', 'item-guid', extractText(item.guid)])
	]);

	const channelEvent = {
		kind: 33333,
		tags: channelTags,
		content: extractText(feed.description) || ''
	};

	const itemEvents = items.map((item) => {
		const itemGuid = extractText(item.guid);

		const tags = clean([
			['d', itemGuid],
			['title', extractText(item.title)],
			['duration', extractText(item['itunes:duration']) || item.duration?.toString()],
			['pubDate', extractText(item.pubDate)],
			['season', extractText(item['podcast:season'])],
			['episode', extractText(item['podcast:episode'])],
			['enclosure', item.enclosure?.['@_url'], item.enclosure?.['@_type']],
			['explicit', extractText(item['itunes:explicit'])?.toLowerCase()],
			['ref', 'channel-guid', channelGuid],
			['i', `podcast:item:guid: ${itemGuid}`],
			item['itunes:image']?.['@_href'] ? ['image', item['itunes:image']['@_href']] : null,
			...parseSplits(item['podcast:value'])
		]);

		return {
			kind: 33334,
			tags,
			content: extractText(item.description) || ''
		};
	});

	return {
		33333: channelEvent,
		33334: itemEvents
	};
}

function extractText(val) {
	if (typeof val === 'string') return val;
	if (typeof val === 'number') return val.toString();
	if (typeof val === 'object' && val !== null && '#text' in val) return val['#text'];
	return undefined;
}

function clean(tags) {
	return tags.filter((t) => Array.isArray(t) && t.every((v) => v !== undefined && v !== null));
}

function parseSplits(valueBlock) {
	if (!valueBlock || !valueBlock['podcast:valueRecipient']) return [];

	const recipients = Array.isArray(valueBlock['podcast:valueRecipient'])
		? valueBlock['podcast:valueRecipient']
		: [valueBlock['podcast:valueRecipient']];

	return recipients
		.map((r) => {
			const name = r['@_name'];
			const type = r['@_type'];
			const address = r['@_address'];
			const split = r['@_split'];

			if (!type || !address || !split) return null;
			return ['value_recipient', name, type, address, split];
		})
		.filter(Boolean);
}
