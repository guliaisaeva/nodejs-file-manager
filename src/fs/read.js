import { createReadStream } from 'node:fs';

export const read = (filePath) => {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(filePath, { encoding: 'utf8' });

    readStream.on('data', (chunk) => {
      process.stdout.write(chunk);
    });

    readStream.on('end', () => {
      console.log('\nFile reading completed.');
      resolve();
    });

    readStream.on('error', (error) => {
      reject(`Error reading file: ${error.message}`);
    });
  });
};


