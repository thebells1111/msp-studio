import dotenv from 'dotenv';
import { json, error } from '@sveltejs/kit';
import { getCollection } from '../_db/connect';

import { getUserInfo, checkAwtCookie } from '../../alby/helpers';

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
		const userArray = await collection.find({ name }).toArray();
		const user = userArray[0] ? { ...userArray[0], _id: undefined } : {};

		if (user.wordPressCreds) {
			user.urls = user.wordPressCreds.map((v) => v.url);
			delete user.wordPressCreds;
			user.wpCreds = true;
		}

		return json(user);
	} catch (err) {
		console.error('Error: ', err);
		throw error(500);
	}
}
