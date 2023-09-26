import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/', async (req, res) => {
	const query = req.query.q || '';

	let response = await fetch(query);
	let data = await response.text();

	res.send(data);
});

export default router;
