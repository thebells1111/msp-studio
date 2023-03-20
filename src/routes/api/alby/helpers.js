import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { dev } from '$app/environment';

if (!process.env.ALBY_ID) {
	dotenv.config();
}

const { ALBY_ID, ALBY_SECRET, ALBY_JWT } = process.env;

export async function refreshToken(token) {
	const res = await axios.post(
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

	return res.data;
}

export async function getUserInfo(token) {
	const user = await axios({
		url: 'https://api.getalby.com/user/value4value',
		headers: { Authorization: `Bearer ${token.access_token}` }
	});

	return user.data.lightning_address;
}

export async function checkAwtCookie(cookies) {
	const awt = cookies.get('awt');

	if (!awt) {
		cookies.set('awt', '', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 0
		});

		return false;
	}

	try {
		const token = jwt.verify(awt, ALBY_JWT);
		return { token };
	} catch (err) {
		return { err };
	}
}
