export async function uploadFileToWordPress(file) {
	// Get the WordPress REST API endpoint for media uploads
	const mediaEndpoint = 'https://truefansmusic.com' + '/wp-json/wp/v2/media';

	// Create a FormData object to send with the file
	const formData = new FormData();
	formData.append('file', file);

	// Send a POST request to the media endpoint with the FormData
	const response = await fetch(mediaEndpoint, {
		method: 'POST',
		body: formData,
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: 'Bearer 2XpW 3ZhP PlMa ux4I FV5I SDQx'
		}
	});

	// If the response was successful, return the JSON data
	if (response.ok) {
		const jsonData = await response.json();
		return jsonData;
	}

	// If the response was not successful, throw an error
	throw new Error(`Failed to upload file to WordPress: ${response.status} ${response.statusText}`);
}
