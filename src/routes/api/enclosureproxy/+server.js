import { json, text } from '@sveltejs/kit';

export async function GET({ url }) {
	let audioUrl = url.searchParams.get('url');

	const response = await fetch(audioUrl, { method: 'HEAD' });

	const contentLengthHeader = response.headers.get('Content-Length');
	const enclosureLength = parseInt(contentLengthHeader);
	const contentTypeHeader = response.headers.get('Content-Type');
	const fileType = contentTypeHeader.split('/')[1];
	let enclosureType = `audio/${fileType}`;
	if (fileType === 'mp3') {
		enclosureType = 'audio/mpeg';
	} else if (fileType === 'ogg' || fileType === 'opus') {
		enclosureType = 'audio/ogg';
	} else {
		enclosureType = 'audio/' + fileType;
	}

	let jsonData = { enclosureLength, enclosureType };
	return json(jsonData);
}
