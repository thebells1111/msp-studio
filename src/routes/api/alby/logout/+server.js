import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

export async function GET({ cookies }) {
	cookies.set('awt', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: !dev,
		maxAge: 0
	});
	return json({ loggedIn: false });
}
