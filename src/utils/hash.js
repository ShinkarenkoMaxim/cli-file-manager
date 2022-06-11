import crypto from 'crypto';
import { readFile } from 'node:fs/promises';

export const hash = async (path) => {
  let result = null;

  try {
    const data = await readFile(path);
    result = crypto.createHash('sha256').update(data).digest('hex');
  } catch (err) {
    console.log('Operation failed');
  }

  return result;
};
