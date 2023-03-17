import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { json, error, text, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

if (!process.env.ALBY_JWT) {
	dotenv.config();
}

const { ALBY_ID, ALBY_SECRET, ALBY_JWT } = process.env;

export async function GET({ url, cookies }) {
	try {
		let awt = cookies.get('awt');
		let token = awt ? jwt.verify(awt, ALBY_JWT) : undefined;

		if (token) {
			let res = await axios.post(
				'https://api.getalby.com/oauth/token',
				{
					refresh_token: token.refresh_token,
					grant_type: 'refresh_token'
				},
				{
					auth: {
						username: ALBY_ID,
						password: ALBY_SECRET
					},
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}
			);

			if (res.data.access_token) {
				let newToken = jwt.sign(res.data, ALBY_JWT, {
					expiresIn: '10d'
				});
				cookies.set('awt', newToken, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: !dev,
					maxAge: 60 * 60 * 24 * 30
				});
				console.log('hi');
				return json({ loggedIn: true });
			}
		}

		return json({ loggedIn: false });
	} catch (err) {
		console.error('alby err: ', err);
		throw error(500, { message: err.response?.data?.error_description });
	}
}
