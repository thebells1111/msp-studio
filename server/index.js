import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import session from 'express-session';
import dotenv from 'dotenv';
import router from './routes/index.js';
import crypto from 'crypto';

dotenv.config();
const { ADMIN_USER, ADMIN_PASS } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const DEV = process.env.DEV === 'true';
const SECRET_KEY = crypto.randomBytes(32).toString('hex');

if (ADMIN_USER && ADMIN_PASS) {
	app.use(
		session({
			secret: SECRET_KEY,
			resave: false,
			saveUninitialized: true,
			cookie: {
				httpOnly: true,
				sameSite: 'strict'
			}
		})
	);
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (DEV) {
	app.use(
		cors({
			origin: ['http://localhost:3000', 'http://localhost:3333'],
			methods: 'GET,HEAD,POST',
			credentials: true
		})
	);
} else {
	app.use((req, res, next) => {
		const requestOrigin = req.headers.origin;
		const serverOrigin = `${req.protocol}://${req.hostname}`;
		if (requestOrigin === serverOrigin) {
			res.header('Access-Control-Allow-Origin', requestOrigin);
			res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST');
			res.header('Access-Control-Allow-Credentials', 'true');
		}
		next();
	});
}

const checkAuth = (req, res, next) => {
	if (req.session.isAuthenticated) {
		next();
	} else {
		res.redirect('/login');
	}
};

if (ADMIN_USER && ADMIN_PASS) {
	app.get('/', checkAuth, (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});

	app.get('/login', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'login.html'));
	});

	app.post('/login', express.json(), async (req, res) => {
		const { username, password } = req.body;
		if (username === ADMIN_USER && password === ADMIN_PASS) {
			req.session.isAuthenticated = true;
			res.send('OK');
		} else {
			res.status(401).send('Unauthorized');
		}
	});
}

app.use(express.static('public'));
app.use((req, res, next) => {
	let filePath;
	let folderPath;
	if (req.path.endsWith('.html') || req.path === '/') {
		filePath = path.join(__dirname, 'public', req.path === '/' ? 'index.html' : req.path);
		folderPath = path.join(__dirname, 'public', req.path, 'index.html');
	} else {
		filePath = path.join(__dirname, 'public', req.path);
		folderPath = null;
	}

	if (fs.existsSync(filePath)) {
		return res.sendFile(filePath);
	}

	if (fs.existsSync(folderPath)) {
		return res.sendFile(folderPath);
	}

	next();
});

app.use('/', router);

app.use((req, res) => {
	const notFoundPath = path.join(__dirname, 'public', '404.html');
	res.status(404).sendFile(notFoundPath);
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
