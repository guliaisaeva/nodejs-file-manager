import fs from 'node:fs/promises';

export const deleteFile = async (filePath) => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`File deleted: ${filePath}`);
    } catch (error) {
        console.error(`Operation failed: ${error.message}`);
    }
}