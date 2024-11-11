import { remoteServer } from '$/stores';

export default async function getFeeds() {
	try {
		const response = await fetch(remoteServer + '/api/database');

		const data = await response.json();

		if (Object.keys(data).length === 0) {
			return {};
		} else {
			return data;
		}
	} catch (err) {
		console.error('Error:', err);
		return {};
	}
}
