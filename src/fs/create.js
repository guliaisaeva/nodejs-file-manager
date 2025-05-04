import { writeFile,access} from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { constants } from 'node:fs';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createEmptyFile = async (fileName) => {
  try {
    const filePath = path.join(__dirname, fileName);
    await access(filePath, constants.F_OK)
    .then(() => {
      console.log(`File "${fileName}" already exists in the directory: ${__dirname}`);
    })
    .catch(async () => {
      await writeFile(filePath, '');
      console.log(`File "${fileName}" has been created successfully in the directory: ${__dirname}`);
    });
  } catch (error) {
    console.error(`Error creating file: ${error.message}`);
  }
};