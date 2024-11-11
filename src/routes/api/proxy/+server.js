import { text } from '@sveltejs/kit';

export async function GET({ url }) {
	console.log(url);
	let q = url.searchParams.get('q') ?? '';
	console.log(q);

	// we can now simply pass on the original 3rd-party api response promise
	let res = await fetch(q);
	let data = await res.text();
	return text(data);
}
