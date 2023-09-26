import express from 'express';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const router = express.Router();

router.get('/', async (req, res) => {
	const guid = req.query.guid || '';
	if (!isValidGUID(guid)) {
		console.error('invalid guid');
		return res.status(400).send('Invalid GUID');
	}

	const folderPath = path.join(__dirname, '../../public/albums', guid);

	if (!fs.existsSync(folderPath)) {
		console.error('folder not found');
	}

	const archive = archiver('zip');
	archive.setMaxListeners(10);

	archive.glob('**/*', { cwd: folderPath });

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

	res.setHeader('Content-Disposition', `attachment; filename=${guid}.zip`);
	res.setHeader('Content-Type', 'application/zip');

	readableStream.pipe(res);
});

function isValidGUID(guid) {
	const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return regex.test(guid);
}

export default router;
