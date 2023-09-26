export default async function getFeeds() {
	const response = await fetch('/api/database');

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return {};
	}
}
