import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import router from './routes/index.js'; // Assuming routes folder is at same level as index.js

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

const app = express();
let dev = true;
const port = 8000;

// Middleware

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
if (dev) {
	app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3333'] }));
}

// Static Files
app.use(express.static('public'));

app.use((req, res, next) => {
	let filePath;
	let folderPath;
	if (req.path.endsWith('.html') || req.path === '/') {
		filePath = path.join(__dirname, 'public', req.path === '/' ? 'index.html' : req.path);
		folderPath = path.join(__dirname, 'public', req.path, 'index.html');
	} else {
		filePath = path.join(__dirname, 'public', req.path);
		folderPath = null; // Don't look for folder if not an HTML request
	}

	if (fs.existsSync(filePath)) {
		return res.sendFile(filePath);
	}

	if (fs.existsSync(folderPath)) {
		return res.sendFile(folderPath);
	}

	next();
});

// Routes
app.use('/', router);

app.use((req, res) => {
	const notFoundPath = path.join(__dirname, 'public', '404.html');
	res.status(404).sendFile(notFoundPath);
});

// Server Start
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
