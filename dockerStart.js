import fs from 'fs';
import crypto from 'crypto';
import readline from 'readline';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const DEV = process.env.DEV === 'true';

const secretKey = crypto.randomBytes(32).toString('hex');
let envContent = `SECRET_KEY=${secretKey}\n`;

// Set default paths for mspDB and albums
envContent += `MSPDB_PATH=${path.resolve(process.cwd(), './storage/mspDB')}\n`;
envContent += `ALBUMS_PATH=${path.resolve(process.cwd(), './storage/albums')}\n`;

// Add CREDENTIALS_PATH only in development
if (DEV) {
	const currentDir = process.cwd();
	const credentialsPath = path.resolve(currentDir, 'credentials', 'credentials.json');
	process.env.CREDENTIALS_PATH = credentialsPath;
	envContent += `CREDENTIALS_PATH=${credentialsPath.replace(/\\/g, '\\\\')}\n`;
}

// Write to .env file
fs.writeFileSync('.env', envContent);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const filePath = process.env.CREDENTIALS_PATH;

console.log(filePath);

const storeCredentials = async (username, password) => {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	fs.writeFileSync(filePath, JSON.stringify({ username, hashedPassword }));
};

const promptOverwrite = () => {
	console.log('credentials.json already exists. Overwrite? (y/N):');
	rl.question('', (data) => {
		const answer = data.toString().trim();
		process.stdout.write('\x1Bc'); // Clear the entire terminal
		if (answer.toLowerCase() === 'y') {
			process.stdout.write('\x1Bc');
			promptUser();
		} else {
			rl.close();
			process.exit(0);
		}
	});
};

const promptUser = () => {
	rl.stdoutMuted = false;
	console.log('Enter initial username for log in: ');
	rl.question('', (username) => {
		if (!username) {
			process.stdout.write('\x1Bc');
			console.log("Username must be entered. Let's start over.");
			console.log();
			return promptUser();
		}
		process.stdout.write('\x1Bc');
		rl.stdoutMuted = true;
		console.log('Enter password: ');
		rl.question('', (password1) => {
			if (!password1) {
				process.stdout.write('\x1Bc');
				console.log("Password must be entered. Let's start over.");
				console.log();
				return promptUser();
			}
			process.stdout.write('\x1Bc');
			console.log('Re-enter password: ');
			rl.question('', async (password2) => {
				if (password1 === password2) {
					await storeCredentials(username, password1);
					rl.close();
					process.exit(0);
				} else {
					process.stdout.write('\x1Bc');
					console.log("Passwords do not match. Let's start over.");
					console.log();
					promptUser();
				}
			});
		});

		rl._writeToOutput = function _writeToOutput(stringToWrite) {
			if (rl.stdoutMuted) {
				rl.output.write('');
			} else {
				rl.output.write(stringToWrite);
			}
		};
	});
};

if (fs.existsSync(filePath)) {
	promptOverwrite();
} else {
	promptUser();
}
