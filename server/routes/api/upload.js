import express from 'express';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import multer from 'multer';
import { promises as fsPromises } from 'fs';

const router = express.Router();
const writeFolder = path.resolve(process.cwd(), './public');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
	try {
		const { file } = req;
		const { fileName, folderName } = req.body;

		const ext = path.extname(file.originalname);
		const newFileName = `${fileName}${ext}`;
		const dir = `${writeFolder}/albums/${folderName}`;

		// Ensure directory exists
		await fsPromises.mkdir(dir, { recursive: true });

		const filePath = `${dir}/${newFileName}`;

		// Write file
		await pipeline(file.stream, fs.createWriteStream(filePath));

		res.json({ success: true, path: filePath.split(writeFolder)[1] });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false });
	}
});

export default router;
