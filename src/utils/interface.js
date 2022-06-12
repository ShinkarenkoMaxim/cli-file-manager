import { homedir } from 'os';
import { resolve } from 'path';
import * as readline from 'readline';

// Utils modules
import { getUsername } from './args.js';
import { changeDirectory, listDir } from './navigation.js';
import { cat, touch, rn, remove, cp, mv } from './files.js';
import { hash } from './hash.js';
import {
  printEOL,
  printCpusInfo,
  printHomedir,
  printSystemUsername,
  printArch,
} from './os.js';

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

        // Send new prompt
        this.cli.prompt();

        return;
      }

      const command = input.split(' ')[0];
      const options = input.replace(command, '').trim() || [];

      let targetDir;
      let targetPath;
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
          targetDir = options; // Parse all entered text after command as path

          result = await changeDirectory(this.cwd, targetDir);
          if (result) {
            this.cwd = result;
          }

          // Update prompt message after change working directory
          this.updatePromptMessage();

          break;
        case 'ls':
          await listDir(this.cwd);

          break;
        case 'cat':
          targetPath = resolve(this.cwd, options); // Parse all entered text after command as filename and save in options

          result = await cat(targetPath);
          if (result) {
            process.stdout.write(result);
          }

          break;
        case 'add':
          targetPath = resolve(this.cwd, options); // Parse all entered text after command as filename and save in options

          await touch(targetPath);

          break;
        case 'rn': {
          const paths = options.split(' '); // Split paths. We cannot use spaces in path
          const oldPath = resolve(this.cwd, paths[0]);
          const newPath = resolve(this.cwd, paths[1]);

          await rn(oldPath, newPath);

          break;
        }
        case 'cp': {
          const paths = options.split(' '); // Split paths. We cannot use spaces in path
          const sourcePath = resolve(this.cwd, paths[0]);
          const destPath = resolve(this.cwd, paths[1]);

          await cp(sourcePath, destPath);

          break;
        }
        case 'mv': {
          const paths = options.split(' '); // Split paths. We cannot use spaces in path
          const sourcePath = resolve(this.cwd, paths[0]);
          const destPath = resolve(this.cwd, paths[1]);

          await mv(sourcePath, destPath);

          break;
        }
        case 'rm':
          targetPath = resolve(this.cwd, options); // Parse all entered text after command as filename and save in options

          await remove(targetPath);

          break;
        case 'hash':
          targetPath = resolve(this.cwd, options); // Parse all entered text after command as filename and save in options

          result = await hash(targetPath);
          if (result) {
            console.log(result);
          }

          break;
        case 'os':
          const allowedSubArgs = [
            '--EOL',
            '--cpus',
            '--homedir',
            '--username',
            '--architecture',
          ];
          if (allowedSubArgs.includes(options)) {
            let operationResult;

            switch (options) {
              case '--EOL':
                operationResult = printEOL();

                break;
              case '--cpus':
                operationResult = printCpusInfo();

                break;
              case '--homedir':
                operationResult = printHomedir();

                break;
              case '--username':
                operationResult = printSystemUsername();

                break;
              case '--architecture':
                operationResult = printArch();

                break;
            }

            console.log(operationResult);
          } else {
            console.log('Invalid input');
          }

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
