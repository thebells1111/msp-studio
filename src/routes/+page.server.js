import { writeFile, mkdir } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const file = data.get('file');
		const dir = './files';

		// Ensure directory exists
		await mkdir(dir, { recursive: true });

		// Write file
		await pipeline(file.stream(), createWriteStream(`${dir}/${file.name}`));

		return { success: true };
	},
	register: async (event) => {
		// TODO register the user
	}
};
