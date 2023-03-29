import dotenv from 'dotenv';
import { getUserInfo, checkAwtCookie } from '../../alby/helpers';

import { json, error } from '@sveltejs/kit';
import { encryptString } from '../_db/keys';
import { getCollection } from '../_db/connect';

if (!process.env.WP_SECRET_KEY) {
	dotenv.config();
}

const { WP_SECRET_KEY } = process.env;

export async function POST({ request, cookies }) {
	let creds = await request.json();
	const record = encryptString(JSON.stringify(creds), WP_SECRET_KEY);

	try {
		const { token, error } = await checkAwtCookie(cookies);
		if (!token) {
			if (error) {
				console.error('Token verification error:', error);
			}
			return json({ loggedIn: false, name: '' });
		}

		const name = await getUserInfo(token);
		if (!name) {
			return json({ loggedIn: false, name: '' });
		}

		const collection = await getCollection('users');
		const url = creds.url;

		// Update the existing key-value pair in the wordPressCreds array
		const updateResult = await collection.updateOne(
			{ name, 'wordPressCreds.url': url },
			{
				$set: { 'wordPressCreds.$.record': record }
			}
		);

		// If the key-value pair is not found, push a new object to the wordPressCreds array
		if (updateResult.matchedCount === 0) {
			await collection.updateOne(
				{ name },
				{
					$push: { wordPressCreds: { url, record } }
				},
				{ upsert: true }
			);
		}
		return json({ wpCreds: true });
	} catch (err) {
		console.error('wpUpdate error:', err);
		throw error(500);
	}
}
