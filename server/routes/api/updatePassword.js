import express from 'express';
import bcrypt from 'bcrypt';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const filePath = process.env.CREDENTIALS_PATH;

router.post('/', async (req, res) => {
	const { username, oldPassword, newPassword, newPasswordCheck } = req.body;

	const credentials = JSON.parse(fs.readFileSync(filePath, 'utf8'));

	const isMatch = await bcrypt.compare(oldPassword, credentials.hashedPassword);
	if (!isMatch || username !== credentials.username) {
		return res.status(401).send('Invalid credentials');
	}

	if (newPassword !== newPasswordCheck) {
		return res.status(400).send('New passwords do not match');
	}

	const saltRounds = 10;
	const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);
	fs.writeFileSync(filePath, JSON.stringify({ username, hashedPassword: newHashedPassword }));

	res.send('Password updated successfully');
});

export default router;
