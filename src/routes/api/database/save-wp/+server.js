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
	console.log(creds);
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
		const userArray = await collection.find({ name }).toArray();
		const user = userArray[0] ? { ...userArray[0], _id: undefined } : {};

		let wpCreds = user.wordPressCreds || [];

		wpCreds = updateObject(wpCreds, url, record);

		await collection.updateOne(
			{ name },
			{
				$set: {
					wordPressCreds: wpCreds
				}
			},
			{
				upsert: true
			}
		);

		return json({ wpCreds: true });
	} catch (err) {
		console.error('wpUpdate error:', err);
		throw error(500);
	}
}

function updateObject(arr, key, newValue) {
	let keyExists = false;
	for (let obj of arr) {
		if (key in obj) {
			keyExists = true;
			obj[key] = newValue;
			break;
		}
	}
	if (!keyExists) {
		arr.push({ [key]: newValue });
	}
	return arr;
}
