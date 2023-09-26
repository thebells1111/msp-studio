export default async function postFeeds(data) {
	const response = await fetch('/api/database', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	if (response.ok) {
		return 'Data stored successfully';
	} else {
		return 'Failed to store data';
	}
}
