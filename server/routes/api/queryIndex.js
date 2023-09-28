import express from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';
const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const apiHeaderTime = Math.floor(Date.now() / 1000);
		const sha1Hash = crypto.createHash('sha1');
		const data4Hash =
			'YAM7QFL6ACW6T25JNPZ7' + 'guNhjF4MkQZbhYR9tpFg7WXzhxk9jG5WcaQHBY7m' + apiHeaderTime;
		sha1Hash.update(data4Hash);
		const hash4Header = sha1Hash.digest('hex');

		const options = {
			method: 'get',
			headers: {
				'X-Auth-Date': `${apiHeaderTime}`,
				'X-Auth-Key': 'YAM7QFL6ACW6T25JNPZ7',
				Authorization: hash4Header,
				'User-Agent': 'MusicSideProject'
			}
		};

		const baseUrl = 'https://api.podcastindex.org/api/1.0/';
		const q = req.query.q ?? '';
		const finalUrl = baseUrl + encodeUrlParameters(q);
		const apiRes = await fetch(finalUrl, options);

		if (apiRes.status === 404 || apiRes.status === 401) {
			return res.json({
				description:
					'Feed was not added. Please visit https://podcastindex.org/add and try adding your feed manually.'
			});
		}

		if (apiRes.status === 302) {
			return res.json({
				description:
					'Feed was not added. Please visit https://podcastindex.org/add and try adding your feed manually.'
			});
		}

		let data;

		try {
			data = await apiRes.text();
			data = JSON.parse(data);
		} catch (error) {
			data = { data };
		}

		res.json(data);
	} catch (err) {
		console.error('queryindex err: ', err);
		res.status(500).json({ message: err });
	}
});

function encodeUrlParameters(inputString) {
	const strArr = inputString.split('?');
	const baseUrl = strArr[0];
	const urlParams = new URLSearchParams(strArr[1]);
	const encodedParams = [];

	for (const [key, value] of urlParams.entries()) {
		encodedParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
	}

	const encodedQueryString = encodedParams.join('&');
	return `${baseUrl}?${encodedQueryString}`;
}

export default router;
