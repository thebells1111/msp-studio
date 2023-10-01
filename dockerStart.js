import fs from 'fs';
import crypto from 'crypto';
import readline from 'readline';
import bcrypt from 'bcrypt';

const secretKey = crypto.randomBytes(32).toString('hex');

// Write to .env file
fs.writeFileSync('.env', `SECRET_KEY=${secretKey}`);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// const filePath = '/usr/src/app/msp/credentials.json';
const filePath = 'credentials.json';

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
