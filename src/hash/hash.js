import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';


export const fileHash = async (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const readStream = fs.createReadStream(filePath);

        readStream.on('data', (chunk) => {
            hash.update(chunk);
        });

        readStream.on('error', (error) => {
            reject(`Error reading file: ${error.message}`);
        });

        readStream.on('end', () => {
            resolve(hash.digest('hex'));
        });
    });
};
