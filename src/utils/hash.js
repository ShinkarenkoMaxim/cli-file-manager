import { resolve } from 'path';
import { readFile } from 'node:fs/promises';
import crypto from 'crypto';

import { ERROR } from './constants.js';

export const hash = async (cwd, path) => {
  let result = null;

  try {
    const filePath = resolve(cwd, path);
    const data = await readFile(filePath);
    result = crypto.createHash('sha256').update(data).digest('hex');
  } catch (err) {
    console.log(ERROR.FAILED);
  }

  return result;
};
