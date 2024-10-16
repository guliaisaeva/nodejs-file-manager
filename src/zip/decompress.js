import fs from 'node:fs';
import {createBrotliDecompress } from 'node:zlib';

export const decompressFile = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(inputPath);
        const writeStream = fs.createWriteStream(outputPath);
        const brotliDecompress = createBrotliDecompress();

        readStream
            .pipe(brotliDecompress)
            .pipe(writeStream)
            .on('finish', () => {
                console.log(`File decompressed to ${outputPath}`);
                resolve();
            })
            .on('error', (error) => {
                reject(`Error decompressing file: ${error.message}`);
            });
    });
};
