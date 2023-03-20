import dotenv from 'dotenv';
import { getUserInfo, checkAwtCookie } from '../alby/helpers';

import { json } from '@sveltejs/kit';
import { getCollection } from '../database/_db/connect';
import { decryptString } from '../database/_db/keys';

if (!process.env.WP_SECRET_KEY) {
	dotenv.config();
}

const { WP_SECRET_KEY } = process.env;

//You likely changed the Settings -> Permalink

// I had changed it to just post. Once I changed it to custom

// index.php/%postname%

//install Password Protected and enable REST API

// Install WP Extra File Types and enable RSS - Really Simple Syndication	.xml

export async function POST({ request, cookies }) {
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

		if (!user.wordPressCreds) {
			return json({ wpCreds: false });
		}

		const WP_CREDS = JSON.parse(decryptString(user.wordPressCreds, WP_SECRET_KEY));

		const mediaEndpoint = WP_CREDS.url.replace(/\/+$/, '') + '/wp-json/wp/v2/media';

		const formData = await request.formData();
		let filename = '';

		for (const entry of formData.entries()) {
			if (entry[0] === 'file') {
				filename = entry[1].name;
				break;
			}
		}

		const response = await fetch(mediaEndpoint, {
			method: 'POST',
			body: formData,
			headers: {
				Authorization:
					'Basic ' + Buffer.from(`${WP_CREDS.name}:${WP_CREDS.secret}`).toString('base64'),
				'Content-Disposition': `form-data; filename="${filename}"`
			}
		});

		if (response.ok) {
			const jsonData = await response.json();
			jsonData.wpCreds = true;
			return json(jsonData);
		} else {
			console.log(
				`Failed to upload file to WordPress: ${response.status} ${
					response.statusText
				} ${JSON.stringify(response)}`
			);
			return json('failedAuth: true');
		}
	} catch (error) {
		console.error(error);
		throw error(500);
	}
}
