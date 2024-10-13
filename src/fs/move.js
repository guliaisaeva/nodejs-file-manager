import fs from 'node:fs';
import path from 'node:path';

export const moveFile = async (fromPath, toDirectory) => {
    try {
        await fs.promises.access(fromPath);

        const fileName = path.basename(fromPath);
        const newFileName = `${path.parse(fileName).name}_moved${path.extname(fileName)}`;
        const toPath = path.join(toDirectory, newFileName);

        const readStream = fs.createReadStream(fromPath);
        const writeStream = fs.createWriteStream(toPath);

        return new Promise((resolve, reject) => {
            readStream.pipe(writeStream);

            writeStream.on('finish', async () => {
                try {
                    await fs.promises.unlink(fromPath);
                    resolve(toPath);
                } catch (error) {
                    reject(`Error deleting the original file: ${error.message}`);
                }
            });

            writeStream.on('error', (error) => reject(`Error writing file: ${error.message}`));
            readStream.on('error', (error) => reject(`Error reading file: ${error.message}`));
        });
    } catch (error) {
        console.error(`Operation failed: ${error.message}`);
    }
};
