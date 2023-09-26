import express from 'express';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

const router = express.Router();

router.get('/', async (req, res) => {
	let { guid } = req.query;
	if (!isValidGUID(guid)) {
		console.log('Invalid GUID');
		return res.status(400).send('Invalid GUID');
	}

	const folderPath = path.resolve(process.cwd(), './static/albums', guid);
	if (!fs.existsSync(folderPath)) {
		console.log('Folder not found');
		return res.status(404).send('Folder not found');
	}

	const archive = archiver('zip');
	archive.setMaxListeners(100);
	archive.glob('feed.xml', { cwd: folderPath });

	archive.on('data', (chunk) => {
		res.write(chunk);
	});

	archive.once('end', () => {
		res.end();
	});

	res.setHeader('Content-Disposition', `attachment; filename=${guid}.zip`);
	res.setHeader('Content-Type', 'application/zip');

	archive.finalize();
});

function isValidGUID(guid) {
	const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return regex.test(guid);
}

export default router;
