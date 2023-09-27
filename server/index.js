import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import router from './routes/index.js'; // Assuming routes folder is at same level as index.js

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
let dev = true;
const port = dev ? 8000 : 3000;

// Middleware

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
if (dev) {
	app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3333'] }));
}

app.use((req, res, next) => {
	const filePath = path.join(
		__dirname,
		'public',
		req.path === '/' ? '/index.html' : `${req.path}.html`
	);
	const folderPath = path.join(__dirname, 'public', req.path, 'index.html');

	if (fs.existsSync(filePath)) {
		return res.sendFile(filePath);
	}

	if (fs.existsSync(folderPath)) {
		return res.sendFile(folderPath);
	}

	next();
});

// Static Files
app.use(express.static('public'));

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
