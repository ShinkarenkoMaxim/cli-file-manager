import { getUsername } from './utils/args.js';
import { setupInterface } from './utils/interface.js';

const userName = getUsername();

setupInterface(userName);
