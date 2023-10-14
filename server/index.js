import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'fs';
import session from 'express-session';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import router from './routes/index.js';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
const ALBUMS_PATH = process.env.ALBUMS_PATH;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 8000;
const DEV = process.env.DEV === 'true';

// Session setup
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

// Rate limiter
const loginLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	message: 'Too many login attempts, please try again later.'
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
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

// Authentication middleware
const checkAuth = (req, res, next) => {
	if (req.session.isAuthenticated) {
		next();
	} else {
		res.redirect('/login');
	}
};

// Routes
app.get('/', checkAuth, (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', loginLimiter, express.json(), async (req, res) => {
	const { username, password } = req.body;
	const credentials = JSON.parse(fs.readFileSync(process.env.CREDENTIALS_PATH, 'utf8'));
	if (
		(await bcrypt.compare(password, credentials.hashedPassword)) &&
		username === credentials.username
	) {
		req.session.isAuthenticated = true;
		res.send('OK');
	} else {
		res.status(401).send('Unauthorized');
	}
});

// Static files and custom middleware
app.use(express.static('public'));
app.use('/albums', express.static(ALBUMS_PATH));
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

// API Routes
app.use('/', router);

// Fallback and 404 routes
app.use((req, res) => {
	const notFoundPath = path.join(__dirname, 'public', '404.html');
	res.status(404).sendFile(notFoundPath);
});

// Server start
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
