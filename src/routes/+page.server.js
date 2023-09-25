import { mkdir } from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

const writeFolder = './static';

export const actions = {
	image: async ({ cookies, request }) => {
		return await saveFile({ cookies, request });
	},
	audio: async ({ cookies, request }) => {
		return await saveFile({ cookies, request });
	},
	xml: async ({ cookies, request }) => {
		return await saveFile({ cookies, request });
	},
	lyrics: async ({ cookies, request }) => {
		return await saveFile({ cookies, request });
	},
	chapters: async ({ cookies, request }) => {
		return await saveFile({ cookies, request });
	}
};

async function saveFile({ cookies, request }) {
	const data = await request.formData();
	const file = data.get('file');
	const ext = path.extname(file.name);
	const newFileName = `${data.get('fileName')}${ext}`;

	const folderName = data.get('folderName');
	const dir = `${writeFolder}/albums/${folderName}`;

	// Ensure directory exists
	await mkdir(dir, { recursive: true });

	const filePath = `${dir}/${newFileName}`;

	// Write file
	await pipeline(file.stream(), createWriteStream(filePath));

	return { success: true, path: filePath.split(writeFolder)[1] };
}
