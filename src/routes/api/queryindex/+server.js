import { json, error } from '@sveltejs/kit';
import dotenv from 'dotenv';
import crypto from 'crypto-browserify';

if (!process.env.PI_API_KEY) {
	dotenv.config();
}

const { PI_API_KEY, PI_API_SECRET } = process.env;

export async function GET({ url }) {
	try {
		// ======== Hash them to get the Authorization token ========

		var apiHeaderTime = Math.floor(Date.now() / 1000);
		var sha1Algorithm = 'sha1';
		var sha1Hash = crypto.createHash(sha1Algorithm);
		var data4Hash = PI_API_KEY + PI_API_SECRET + apiHeaderTime;
		sha1Hash.update(data4Hash);
		var hash4Header = sha1Hash.digest('hex');

		let options = {
			method: 'get',
			headers: {
				// not needed right now, maybe in future:  "Content-Type": "application/json",
				'X-Auth-Date': '' + apiHeaderTime,
				'X-Auth-Key': PI_API_KEY,
				Authorization: hash4Header,
				'User-Agent': 'MusicSideProject'
			}
		};

		let baseUrl = 'https://api.podcastindex.org/api/1.0/';
		let q = url.searchParams.get('q') ?? '';
		var url = baseUrl + q;
		const res = await fetch(url, options);
		if (res.status === 404 || res.status === 401) {
			return json({});
		}
		let data = await res.json();

		return json(data);
	} catch (err) {
		console.error('queryindex err: ', err);
		throw error(500, { message: err });
	}
}
