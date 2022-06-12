import { resolve } from 'node:path';
import {
  readFile,
  access,
  writeFile,
  rename,
  rm,
  copyFile,
} from 'node:fs/promises';

import { ERROR } from './constants.js';

export const cat = async (cwd, path) => {
  let result = null;

  try {
    const filePath = resolve(cwd, path);

    await access(filePath);

    result = await readFile(filePath, { encoding: 'UTF-8' });
  } catch (err) {
    console.log(ERROR.FAILED);
  }

  return result;
};

export const touch = async (cwd, path) => {
  try {
    const writePath = resolve(cwd, path);

    await writeFile(writePath, '', { flag: 'wx' });
  } catch (err) {
    console.log(err);
    console.log(ERROR.FAILED);
  }
};

export const rn = async (cwd, paths) => {
  try {
    const oldFile = resolve(cwd, paths[0]);
    const newFile = resolve(cwd, paths[1]);

    await rename(oldFile, newFile);
  } catch (err) {
    console.log(ERROR.FAILED);
  }
};

export const cp = async (cwd, paths) => {
  try {
    const source = resolve(cwd, paths[0]);
    const dest = resolve(cwd, paths[1]);

    await copyFile(source, dest);
  } catch (err) {
    console.log(ERROR.FAILED);
  }
};

export const mv = async (cwd, paths) => {
  try {
    const source = resolve(cwd, paths[0]);
    const dest = resolve(cwd, paths[1]);

    await copyFile(source, dest);
    await rm(source);
  } catch (err) {
    console.log(ERROR.FAILED);
  }
};

export const remove = async (cwd, path) => {
  try {
    const pathToRemove = resolve(cwd, path);

    await rm(pathToRemove);
  } catch (err) {
    console.log(ERROR.FAILED);
  }
};
