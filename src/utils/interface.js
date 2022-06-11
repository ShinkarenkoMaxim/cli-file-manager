import * as readline from 'readline';
import { getCurrentDir } from './path.js';

export const setupInterface = (userName) => {
  const WELCOME_MSG = `Welcome to the File Manager, ${userName}!\n\n${getCurrentDir()}`;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: WELCOME_MSG,
  });

  // Startup application
  rl.prompt(); // Call prompt
  process.stdout.write('> '); // Clear hints

  // Each stdin event
  rl.on('line', () => {
    process.stdout.write(getCurrentDir());
    process.stdout.write('> '); // Clear hints
  });

  // Handle exit program and notify
  rl.on('close', () => {
    process.stdout.write('.exit'); // Clear hints
    console.log(`\nThank you for using File Manager, ${userName}!`);
    process.exit(0);
  });
};
