import express from 'express';
import path from 'path';
import { promises as fsPromises } from 'fs';
import multer from 'multer';

const router = express.Router();
const DEV = process.env.DEV === 'true';

const writeFolder = path.resolve(process.env.ALBUMS_PATH)

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = `${writeFolder}/${req.query.folderName}/${req.query.fileType}`;
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, `${req.query.fileName}${ext}`);
	}
});

const upload = multer({ storage: storage }).single('file');

// Middleware to create directory
async function createDir(req, res, next) {
	const dir = `${writeFolder}/${req.query.folderName}${
		req.query.fileType ? `/${req.query.fileType}` : ''
	}`;
	await fsPromises.mkdir(dir, { recursive: true });
	next();
}

// Apply the middleware before invoking multer
router.post('/', createDir, upload, async (req, res) => {
	if (req.file && req.file.filename) {
		const dir = `${writeFolder}/${req.query.folderName}${
			req.query.fileType ? `/${req.query.fileType}` : ''
		}`;
		const filePath = `${dir}/${req.file.filename}`;
		res.json({ success: true, path: '/albums/' + filePath.split(writeFolder)[1] });
	} else {
		res.status(500).json({ success: false });
	}
});

export default router;
