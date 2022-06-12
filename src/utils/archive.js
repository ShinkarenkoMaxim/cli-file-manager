import { createReadStream, createWriteStream } from 'fs';
import { resolve } from 'path';
import { pipeline } from 'stream';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { ERROR } from './constants.js';

export const compress = (cwd, paths) => {
  try {
    const sourceFilePath = resolve(cwd, paths[0]);
    const destFilePath = resolve(cwd, paths[1]);

    // Create gzip Transform stream
    const brotliCompress = createBrotliCompress();

    // Create Readable and Writeable streams
    const source = createReadStream(sourceFilePath);
    const dest = createWriteStream(destFilePath);

    // Send all streams to pipeline
    pipeline(source, brotliCompress, dest, (err) => {
      if (err) {
        console.log('Operation failed');
      }
    });
  } catch (err) {
    console.log(ERROR.FAILED);
  }
};

export const decompress = (cwd, paths) => {
  try {
    const sourceFilePath = resolve(cwd, paths[0]);
    const destFilePath = resolve(cwd, paths[1]);

    // Create gzip Transform stream
    const brotliCompress = createBrotliDecompress();

    // Create Readable and Writeable streams
    const source = createReadStream(sourceFilePath);
    const dest = createWriteStream(destFilePath);

    // Send all streams to pipeline
    pipeline(source, brotliCompress, dest, (err) => {
      if (err) {
        console.log('Operation failed');
      }
    });
  } catch (err) {
    console.log(ERROR.FAILED);
  }
};
