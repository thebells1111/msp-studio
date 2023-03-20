import crypto from 'crypto';

export function encryptString(str, key) {
	const algorithm = 'aes-256-cbc';
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(str, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return iv.toString('hex') + encrypted;
}

export function decryptString(str, key) {
	const algorithm = 'aes-256-cbc';
	const iv = Buffer.from(str.slice(0, 32), 'hex');
	const encrypted = str.slice(32);
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}

export function generateKey() {
	const keyLength = 32; // 256 bits
	return crypto.randomBytes(keyLength).toString('hex');
}
