import {
  readFile,
  access,
  writeFile,
  rename,
  rm,
  copyFile,
} from 'node:fs/promises';

export const cat = async (path) => {
  let result = null;

  try {
    await access(path);
    result = await readFile(path, { encoding: 'UTF-8' });
  } catch (err) {
    console.log('Operation failed');
  }

  return result;
};

export const touch = async (path) => {
  try {
    await writeFile(path, '', { flag: 'wx' });
  } catch (err) {
    console.log('Operation failed');
  }
};

export const rn = async (oldFile, newFile) => {
  try {
    await rename(oldFile, newFile);
  } catch (err) {
    console.log('Operation failed');
  }
};

export const cp = async (source, dest) => {
  try {
    await copyFile(source, dest);
  } catch (err) {
    console.log('Operation failed');
  }
};

export const mv = async (source, dest) => {
  try {
    await copyFile(source, dest);
    await rm(source);
  } catch (err) {
    console.log('Operation failed');
  }
};

export const remove = async (path) => {
  try {
    await rm(path);
  } catch (err) {
    console.log('Operation failed');
  }
};
