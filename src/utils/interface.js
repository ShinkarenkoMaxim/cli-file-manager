import { homedir } from 'os';
import * as readline from 'readline';

// Utils modules
import { getUsername } from './args.js';
import { changeDirectory, listDir } from './fs.js';

export default class CLIInterface {
  cwd;
  username;
  cli;
  promptMsg;

  constructor() {
    this.cwd = homedir(); // Home directory by default
    this.username = getUsername();
  }

  init() {
    const WELCOME_MSG = `Welcome to the File Manager, ${this.username}!\n`;

    // Show welcome Message
    console.log(WELCOME_MSG);

    // Initialize readline instance
    this.cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.promptMsg,
    });

    // Update prompt message
    this.updatePromptMessage();

    // Register events
    this.registerEvents();

    // Initiate prompt
    this.cli.prompt();
  }

  updatePromptMessage() {
    this.promptMsg = `You are currently in ${this.cwd}\n> `;
    this.cli.setPrompt(this.promptMsg);
  }

  registerEvents() {
    // Each stdin event
    this.cli.on('line', async (input) => {
      // If input data is empty
      if (input == '') {
        console.log('Invalid input');
        return;
      }

      const command = input.split(' ')[0];
      const options = input.split(' ').slice(1) || [];
      let targetDir;
      let result;

      // Filter by commands
      switch (command) {
        case 'up':
          targetDir = '../';
          result = await changeDirectory(this.cwd, targetDir);
          if (result) {
            this.cwd = result;
          }

          // Update prompt message after change working directory
          this.updatePromptMessage();

          break;
        case 'cd':
          // Must be 1 option - path to directory
          if (options.length < 1 || options.length > 1) {
            console.log('Invalid input');
          } else {
            targetDir = options[0];
            result = await changeDirectory(this.cwd, targetDir);
            if (result) {
              this.cwd = result;
            }
          }

          // Update prompt message after change working directory
          this.updatePromptMessage();

          break;
        case 'ls':
          await listDir(this.cwd);

          break;
        default:
          // If command not found
          console.log('Invalid input');

          break;
      }

      // Send new prompt
      this.cli.prompt();
    });

    // Handle exit program and notify
    this.cli.on('close', () => {
      process.stdout.write('.exit'); // Clear hints
      console.log(`\nThank you for using File Manager, ${this.username}!`);
      process.exit(0);
    });
  }
}
