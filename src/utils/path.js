import { homedir } from 'os';

let path = homedir;

export const getCurrentDir = () => `You are currently in ${path}\n`;
