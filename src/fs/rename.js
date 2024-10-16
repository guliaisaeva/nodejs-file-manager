import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const renameFile = async (fileName, newFileName) => {
    const pathToFile = path.join(__dirname, 'files', fileName);
    const pathToNewFile = path.join(__dirname, 'files', newFileName);

    try {
      await fs.access(pathToFile);
    } catch (error) {
      throw new Error(`File "${fileName}" does not exist. Please check the file name.`);
    }

    try {
      await fs.access(pathToNewFile);
      throw new Error(`File "${newFileName}" already exists. Choose a different name.`);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw new Error(`Fs operation failed: ${error.message}`);
      }
    }
    await fs.rename(pathToFile, pathToNewFile);
    console.log(`File renamed to "${newFileName}" successfully! It is inside the "files" folder.`);
  };