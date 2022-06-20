import { homedir } from 'os';
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
import { compress, decompress } from './archive.js';
import { ERROR, getWelcomeMsg } from './constants.js';

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
    // Show welcome Message
    console.log(getWelcomeMsg(this.username));

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

      let result;
      let paths;

      // Filter by commands
      switch (command) {
        case 'up':
          result = await changeDirectory(this.cwd, '../');
          if (result) {
            this.cwd = result;
          }

          // Update prompt message after change working directory
          this.updatePromptMessage();

          break;
        case 'cd':
          result = await changeDirectory(this.cwd, options);
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
          result = await cat(this.cwd, options);
          if (result) {
            process.stdout.write(result);
          }

          break;
        case 'add':
          await touch(this.cwd, options);

          break;
        case 'rn':
          paths = options.split(' '); // Split paths. We cannot use spaces in path

          await rn(this.cwd, paths);

          break;
        case 'cp':
          paths = options.split(' '); // Split paths. We cannot use spaces in path

          await cp(this.cwd, paths);

          break;
        case 'mv':
          paths = options.split(' '); // Split paths. We cannot use spaces in path

          await mv(this.cwd, paths);

          break;
        case 'rm':
          await remove(this.cwd, options);

          break;
        case 'hash':
          result = await hash(this.cwd, options);
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
            console.log(ERROR.INVALID);
          }

          break;
        case 'compress':
          paths = options.split(' '); // Split paths. We cannot use spaces in path

          compress(this.cwd, paths);

          break;
        case 'decompress':
          paths = options.split(' '); // Split paths. We cannot use spaces in path

          decompress(this.cwd, paths);

          break;
        default:
          // If command not found
          console.log(ERROR.INVALID);

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
