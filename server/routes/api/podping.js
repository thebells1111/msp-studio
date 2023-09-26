import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const options = {
			method: 'GET',
			headers: {
				Authorization: 'saX8fk886yUTY7HrEfZ7xp9hHzdh9JFJW28cuDMKuud2',
				'User-Agent': 'MusicSideProject'
			}
		};

		let baseUrl = 'https://podping.cloud/?url=';
		let { url, reason, medium } = req.query;
		if (url) {
			let fetchUrl = baseUrl + url;
			if (reason) {
				fetchUrl += `&reason=${reason}`;
			}
			if (medium) {
				fetchUrl += `&medium=${medium}`;
			}

			const response = await fetch(fetchUrl, options);

			if (response.status === 200) {
				res.status(200).send(await response.text());
			} else {
				res.status(response.status).send(await response.text());
			}
		} else {
			res.status(400).send('Missing URL parameter');
		}
	} catch (error) {
		console.log(error);
		res.status(500).send('Internal Server Error');
	}
});

export default router;
