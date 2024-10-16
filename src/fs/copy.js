import fs from 'node:fs';
import path from 'node:path';

export const copyFile = async (fromPath, toDirectory) => {
    try {
        await fs.promises.access(fromPath);

        const fileName = path.basename(fromPath);
        const newFileName = `${path.parse(fileName).name}_copy${path.extname(fileName)}`;
        const toPath = path.join(toDirectory, newFileName);

        const readStream = fs.createReadStream(fromPath);
        const writeStream = fs.createWriteStream(toPath);

        readStream.on('error', (error) => {
            console.error(`Error reading file: ${error.message}`);
        });

        writeStream.on('error', (error) => {
            console.error(`Error writing file: ${error.message}`);
        });

        readStream.on('end', () => {
            console.log(`File copied to ${toPath}`);
        });

        return new Promise((resolve, reject) => {
            readStream.pipe(writeStream);
            writeStream.on('finish', () => resolve(toPath));
            writeStream.on('error', (error) => reject(error));
        });    } catch (error) {
        console.error(`Operation failed: ${error.message}`);
    }
};
