import dotenv from 'dotenv';
import axios from 'axios';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';

import { json, error, text, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

if (!process.env.ALBY_ID) {
	dotenv.config();
}

const { ALBY_ID, ALBY_SECRET, ALBY_JWT } = process.env;

export async function GET({ url, cookies }) {
	let newToken;
	try {
		let code = url.searchParams.get('code') ?? '';
		var formData = new FormData();
		formData.append('code', code);
		if (dev) {
			formData.append('redirect_uri', 'http://localhost:3000/api/alby/auth');
		} else {
			formData.append('redirect_uri', 'https://studio.musicsideproject.com/api/alby/auth');
		}
		formData.append('grant_type', 'authorization_code');
		let resolve = await axios({
			method: 'POST',
			url: 'https://api.getalby.com/oauth/token',
			auth: {
				username: ALBY_ID,
				password: ALBY_SECRET
			},
			data: formData,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
			}
		});

		newToken = jwt.sign(resolve.data, ALBY_JWT, {
			expiresIn: '10d'
		});

		throw redirect(302, '/');
	} catch (err) {
		if (newToken) {
			cookies.set('awt', newToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: !dev,
				maxAge: 60 * 60 * 24 * 30
			});
			throw redirect(302, '/');
		}

		console.error('alby err: ', err);
		throw error(500, { message: err.response?.data?.error_description });
	}
}
