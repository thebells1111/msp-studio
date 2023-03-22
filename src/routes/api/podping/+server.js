import dotenv from 'dotenv';
import { json, text } from '@sveltejs/kit';

if (!process.env.API_KEY) {
	dotenv.config();
}

const { PODPING } = process.env;

export async function GET({ url }) {
	try {
		let options = {
			method: 'get',
			headers: {
				Authorization: PODPING,
				'User-Agent': 'Sovereign Feeds'
			}
		};

		let baseUrl = 'https://podping.cloud/?url=';
		let feed = url.searchParams.get('url');
		let reason = url.searchParams.get('reason');
		let medium = url.searchParams.get('medium');
		if (feed) {
			let url = baseUrl + feed;
			if (reason) {
				url = url + `&reason=${reason}`;
			}
			if (medium) {
				url = url + `&reason=${medium}`;
			}

			const res = await fetch(url, options);

			if (res.status === 200) {
				return text(await res.text());
			} else {
				return text('Fail');
			}
		}

		return response;
	} catch (error) {
		console.log(error);
		throw error(500);
	}
}
