import express from 'express';
import { Level } from 'level';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const dbPath = path.resolve(process.env.MSPDB_PATH);

const db = new Level(dbPath, { valueEncoding: 'json' });

db.open((err) => {
	if (err) {
		console.error('Error:', err);
	}
});

router.post('/', async (req, res) => {
	try {
		const message = await putFeeds(req.body);

		res.status(200).send(message);
	} catch (err) {
		console.error('Error:', err);
		db.close((err) => {
			if (err) console.error('Failed to close the database:', err);
		});
		res.status(500).send('Internal Server Error');
	}
});

router.get('/', async (req, res) => {
	try {
		const feeds = await getFeeds();
		res.json(feeds);
	} catch (err) {
		console.error('Error:', err);
		db.close((err) => {
			if (err) console.error('Failed to close the database:', err);
		});
		res.status(500).send('Internal Server Error');
	}
});

const putFeeds = (data) =>
	new Promise((resolve, reject) => {
		db.put('feeds', JSON.stringify(data), (err) => {
			if (err) reject(new Error('Internal Server Error'));
			else resolve('Data stored successfully');
		});
	});

const getFeeds = () =>
	new Promise((resolve, reject) => {
		db.get('feeds', (err, value) => {
			if (err) {
				if (err.notFound) resolve({});
				else reject(new Error('Internal Server Error'));
			} else {
				resolve(value);
			}
		});
	});

export default router;
