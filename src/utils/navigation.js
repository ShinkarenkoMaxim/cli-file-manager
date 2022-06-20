import { access, readdir, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';

import { ERROR } from './constants.js';

export const listDir = async (targetDir) => {
  try {
    await access(targetDir);

    const files = await readdir(targetDir);

    console.log(files);
  } catch (err) {
    console.log(ERROR.FAILED);
  }
};

export const changeDirectory = async (cwd, targetDir) => {
  let result = null;

  try {
    const path = resolve(cwd, targetDir);
    const stats = await lstat(path);

    // We cannot move to files. Only in directories
    if (stats.isDirectory()) {
      await access(path);
      result = path;
    } else {
      console.log(ERROR.FAILED);
    }
  } catch (err) {
    console.log(ERROR.FAILED);
  }

  return result;
};
