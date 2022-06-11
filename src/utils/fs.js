import { access, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export const listDir = async (targetDir) => {
  try {
    await access(targetDir);
    const files = await readdir(targetDir);
    console.log(files);
  } catch (err) {
    console.log('Operation failed');
  }
};

export const changeDirectory = async (cwd, targetDir) => {
  let result = null;

  try {
    const path = resolve(cwd, targetDir);
    await access(path);
    result = path;
  } catch (err) {
    console.log('Operation failed');
  }

  return result;
};
