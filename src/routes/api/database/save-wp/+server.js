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
	const record = encryptString(JSON.stringify(await request.json()), WP_SECRET_KEY);

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
		await collection.updateOne(
			{ name },
			{
				$set: {
					wordPressCreds: record
				}
			},
			{ upsert: true }
		);

		return json({ wpCreds: true });
	} catch (err) {
		console.error('wpUpdate error:', err);
		throw error(500);
	}
}
