import { json, error } from '@sveltejs/kit';
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

// Promisify the pipeline function to use with async/await
const pipelineAsync = promisify(pipeline);

export async function POST({ request }) {
	const formData = await request.formData();
	console.log(formData);
	const file = formData.get('file');
	console.log(file);

	const data = {
		success: false,
		errors: {}
	};

	if (!file) {
		data.errors.file = 'required';
		return json(data, { status: 400 });
	}

	// Manually extract the filename from the content-disposition header
	const contentDisposition = request.headers.get('content-disposition');
	const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
	const filename = filenameMatch ? filenameMatch[1] : 'default_filename'; // Use a default filename if none was found

	try {
		// Use a pipeline to write data from the file stream to the disk
		await pipelineAsync(
			file.stream(), // Source stream
			// Destination stream
			fs.createWriteStream(`./static/${filename}`)
		);

		data.success = true;
	} catch (err) {
		console.error('Pipeline failed.', err);
		data.errors.file = 'could not save';
	}

	return json(data);
}
