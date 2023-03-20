import { json } from '@sveltejs/kit';
import { getUserInfo, checkAwtCookie } from '../../alby/helpers';

import { getCollection } from '../_db/connect';

export async function GET({ cookies }) {
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
					[`dude`]: { text: 'cool' }
				}
			},
			{ upsert: true }
		);

		return json({ loggedIn: false });
	} catch (error) {
		console.log('database err: ', error);
		throw error(500);
	}
}
