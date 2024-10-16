import fs from 'node:fs';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib';

export const compressFile = async (inputFilePath, outputDir) => {
    try {
        await fs.promises.access(inputFilePath);

        const fileName = path.basename(inputFilePath);
        const outputFilePath = path.join(outputDir, `${fileName}.br`);

        try {
            await fs.promises.access(outputFilePath);
            console.error(`Error: Compressed file ${outputFilePath} already exists. Please choose a different name or location.`);
            return;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        const readStream = createReadStream(inputFilePath);
        const writeStream = createWriteStream(outputFilePath);
        const brotliCompress = createBrotliCompress();

        readStream.on('error', (error) => {
            console.error(`Error reading file: ${error.message}`);
        });

        writeStream.on('error', (error) => {
            console.error(`Error writing file: ${error.message}`);
        });

        readStream.pipe(brotliCompress).pipe(writeStream);

        writeStream.on('finish', () => {
            console.log(`File compressed to ${outputFilePath}`);
        });
    } catch (error) {
        console.error(`Operation failed: ${error.message}`);
    }
};
