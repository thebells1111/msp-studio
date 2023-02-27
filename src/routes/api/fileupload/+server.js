import { json, text } from '@sveltejs/kit';

//You likely changed the Settings -> Permalink

// I had changed it to just post. Once I changed it to custom

// index.php/%postname%

//install Password Protected and enable REST API

// Install WP Extra File Types and enable RSS - Really Simple Syndication	.xml

const mediaEndpoint = 'https://truefansmusic.com' + '/wp-json/wp/v2/media';

export async function POST({ request }) {
	const formData = await request.formData();

	// Send a POST request to the media endpoint with the FormData
	const response = await fetch(mediaEndpoint, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: 'Basic ' + btoa('user:password'),
			'Content-Disposition': 'form-data; filename="tmp.png"'
		}
	});

	// console.log(response);
	const jsonData = await response.json();
	console.log(jsonData);

	return json(jsonData);

	// If the response was successful, return the JSON data
	if (response.ok) {
		const jsonData = await response.json();
		return json(jsonData);
	}

	// // If the response was not successful, throw an error
	// throw new Error(
	// 	`Failed to upload file to WordPress: ${response.status} ${response.statusText} ${JSON.stringify(
	// 		response
	// 	)}`
	// );
}
