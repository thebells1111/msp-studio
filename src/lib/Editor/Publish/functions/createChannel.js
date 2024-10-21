import normalizeSplits from './normalizeSplits';
import generateValidGuid from '$functions/generateValidGuid.js';

export default async function createChannel({ feed, errors }) {
	errors = errors || [];
	feed.generator = 'Music Side Project Studio';
	feed['itunes:category'] = feed?.['itunes:category'] || { '#text': 'Music' };
	feed['itunes:keywords'] = feed?.['itunes:keywords'] || 'music';
	feed['podcast:medium'] = 'music';

	if (feed?.['itunes:author']) {
		if (!feed['itunes:owner']) {
			feed['itunes:owner'] = {
				'@_itunes:name': feed['itunes:author'],
				'@_itunes:email': ''
			};
		}
	} else {
		errors.push('Band needs a name');
	}

	if (!feed.title) {
		errors.push('Album needs a name');
	}

	if (!feed.description) {
		errors.push('Album needs a description');
	}

	if (!feed?.['itunes:image']?.['@_href']) {
		errors.push('Album needs some artwork');
	}

	if (!feed?.explicit) {
		errors.push('Is the album explicit?');
	}

	if (!isValidUrl(feed?.link)) {
		errors.push('Link to Album Website is an invalid link');
	}

	if (feed?.['itunes:explicit']) {
		errors.push('Is the album explicit?');
	}

	if (feed?.['podcast:value']?.['podcast:valueRecipient']?.some((v) => v?.['@_address'])) {
		feed['podcast:value']['podcast:valueRecipient'] = normalizeSplits(
			feed['podcast:value']['podcast:valueRecipient'],
			'Album',
			errors
		);
	} else {
		errors.push('Add some value to the album');
	}

	if (feed?.['podcast:guid']) {
		feed['podcast:guid'] = await checkPodcastGuid(feed['podcast:guid']);
	} else {
		feed['podcast:guid'] = await createNewPodcastGuid();
	}

	feed['podcast:aspectImages'] = []
		.concat(feed['podcast:aspectImages'])
		.filter((v) => v?.['@_src']);
	if (!feed?.['podcast:aspectImages']?.length) {
		delete feed['podcast:aspectImages'];
	}

	return { feed, errors };
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

function isValidUrl(url) {
	// Create a regular expression pattern that matches valid URLs with http, https, or ftp protocols
	const urlPattern =
		/^(http|https|ftp):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;

	// Test whether the provided URL matches the pattern
	return urlPattern.test(url);
}
