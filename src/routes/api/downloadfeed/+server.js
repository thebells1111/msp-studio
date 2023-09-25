import { text, error } from '@sveltejs/kit';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

export async function GET({ url }) {
	let guid = url.searchParams.get('guid') ?? '';
	if (!isValidGUID(guid)) {
		console.log('invalid guid');
		throw error(400, 'Invalid GUID');
	}

	const folderPath = path.resolve(process.cwd(), './static/albums', guid);
	console.log(folderPath);

	// Validate if folderPath exists
	if (!fs.existsSync(folderPath)) {
		console.log('folder not found');
		throw error(404, 'Folder not found');
	}

	const archive = archiver('zip');
	archive.setMaxListeners(100); // Increase limit to 100

	// Include only the feed.xml file located directly inside the guid folder
	archive.glob('feed.xml', { cwd: folderPath });

	const readableStream = new Readable({
		read() {}
	});

	archive.on('data', (chunk) => {
		readableStream.push(chunk);
	});

	archive.once('end', () => {
		readableStream.push(null);
	});

	archive.finalize();

	return new Response(readableStream, {
		headers: {
			'Content-Disposition': `attachment; filename=${guid}.zip`,
			'Content-Type': 'application/zip'
		}
	});
}

function isValidGUID(guid) {
	const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return regex.test(guid);
}
