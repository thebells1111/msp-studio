import { Level } from 'level';
const db = new Level('mspDB', { valueEncoding: 'json' });
import { text, json, error } from '@sveltejs/kit';

db.open((err) => {
	if (err) {
		console.log('Error:', err);
		throw new Error(500);
	}
	// Database is now open
});

export async function POST({ request }) {
	const body = await request.json();
	try {
		const message = (await putFeeds(body)) || {};
		return text(message);
	} catch (err) {
		console.log('Error:', err);
		throw new Error(500);
	}
}

const putFeeds = (data) => {
	return new Promise((resolve, reject) => {
		db.put('feeds', JSON.stringify(data), function (err) {
			if (err) {
				reject(new Error(500));
				return;
			}
			resolve('Data stored successfully');
		});
	});
};

export async function GET({ url }) {
	try {
		const feeds = await getFeeds();
		return json(feeds);
	} catch (err) {
		console.log('Error:', err);
		throw error(500);
	}
}

const getFeeds = () => {
	return new Promise((resolve, reject) => {
		db.get('feeds', function (err, value) {
			if (err) {
				console.log(err);
				if (err.notFound) {
					resolve({});
				}
				reject(new Error(500));
			}
			resolve(value);
		});
	});
};
