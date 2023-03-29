import dotenv from 'dotenv';
import { getUserInfo, checkAwtCookie } from '../alby/helpers';

import { json } from '@sveltejs/kit';
import { getCollection } from '../database/_db/connect';
import { decryptString } from '../database/_db/keys';

if (!process.env.WP_SECRET_KEY) {
	dotenv.config();
}

const { WP_SECRET_KEY } = process.env;

export async function POST({ request, cookies }) {
	const { url } = await request.json();
	console.log(url);
	try {
		const { token, error } = await checkAwtCookie(cookies);
		if (!token) {
			if (error) {
				console.error('Token verification error:', error);
			}
			return json({ loggedIn: false, name: '' });
		}

		const name = await getUserInfo(token);
		console.log(name);
		if (!name) {
			return json({ loggedIn: false, name: '' });
		}

		const collection = await getCollection('users');

		// Query the database to find a document that matches the given name and url
		const user = await collection.findOne({
			name,
			'wordPressCreds.url': url
		});

		if (!user) {
			return json({ wpCreds: false });
		}

		// Find the matching record within the wordPressCreds array
		const recordObject = user.wordPressCreds.find((cred) => cred.url === url);

		if (!recordObject) {
			return json({ wpCreds: false });
		}

		const WP_CREDS = JSON.parse(decryptString(recordObject.record, WP_SECRET_KEY));

		return json({ ...WP_CREDS, wpCreds: true });
	} catch (error) {
		console.error(error);
		throw error(500);
	}
}
