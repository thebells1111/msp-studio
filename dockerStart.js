import fs from 'fs';
import crypto from 'crypto';
import readline from 'readline';
import bcrypt from 'bcrypt';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const secretKey = crypto.randomBytes(32).toString('hex');
const salt = crypto.randomBytes(32).toString('hex');

fs.writeFileSync('.env', `SECRET_KEY=${secretKey}\nSALT=${salt}\n`);

const storeCredentials = async (username, password) => {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	fs.writeFileSync('credentials.json', JSON.stringify({ username, hashedPassword }));
};

const promptUser = () => {
	rl.stdoutMuted = false;
	console.log('Enter initial username for log in: ');
	rl.question('', (username) => {
		process.stdout.write('\x1Bc');
		rl.stdoutMuted = true;
		console.log('Enter password: ');
		rl.question('', (password1) => {
			process.stdout.write('\x1Bc');
			console.log('Re-enter password: ');
			rl.question('', async (password2) => {
				if (password1 === password2) {
					await storeCredentials(username, password1);
					rl.close();
					process.exit(0);
				} else {
					process.stdout.write('\x1Bc');
					console.log('Passwords do not match. Try again.');
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

promptUser();
