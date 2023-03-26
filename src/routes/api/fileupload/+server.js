import dotenv from 'dotenv';
import { getUserInfo, checkAwtCookie } from '../alby/helpers';

import { json } from '@sveltejs/kit';
import { getCollection } from '../database/_db/connect';
import { decryptString } from '../database/_db/keys';

if (!process.env.WP_SECRET_KEY) {
	dotenv.config();
}

const { WP_SECRET_KEY } = process.env;

export async function GET({ request, cookies }) {
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
		const userArray = await collection.find({ name }).toArray();
		const user = userArray[0] ? { ...userArray[0], _id: undefined } : {};

		if (!user.wordPressCreds) {
			return json({ wpCreds: false });
		}

		const WP_CREDS = JSON.parse(decryptString(user.wordPressCreds, WP_SECRET_KEY));

		return json({ ...WP_CREDS, wpCreds: true });
	} catch (error) {
		console.error(error);
		throw error(500);
	}
}
