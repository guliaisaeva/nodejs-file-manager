import readline from 'node:readline';
import fs from 'node:fs';
import {getUserName}from "../user/user.js";
import { homeDirectory,displayCurrentDirectory,goUp,changeDirectory,listDirectoryContents} from '../directories/directory.js';
import path from 'node:path';
import {read} from "../fs/read.js";
import {createEmptyFile} from "../fs/create.js";
import  {renameFile} from "../fs/rename.js";
import  {copyFile} from "../fs/copy.js";
import  {moveFile} from "../fs/move.js";
import  {deleteFile} from "../fs/delete.js";
import  {handleOsCommand} from "../osInfo/osInfo.js";
import  {fileHash} from "../hash/hash.js";
import  {compressFile} from "../zip/compress.js";
import  {decompressFile} from "../zip/decompress.js";




const userName = getUserName();
console.log(`Welcome to the File Manager, ${userName}!`);
console.log(`Starting working directory is: ${homeDirectory}`);
displayCurrentDirectory();



const handleUserInput = async (input) => {
  try {
    console.log();
    if (input === 'up') {
      goUp();
    } else if (input === '.exit') {
      console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
      process.exit(0);
    } else if (input.startsWith('cd ')) {
      const targetPath = input.slice(3).trim();
      await changeDirectory(targetPath);
    } else if (input === 'ls') {
      await listDirectoryContents();
    }else if (input.trim().startsWith('cat ')) {
      const targetFile = input.slice(4).trim();
      const filePath = path.join(process.cwd(), targetFile);
      await read(filePath);
    }else if (input.trim().startsWith('add ')) {
      const fileName = input.slice(4).trim();
      if (fileName) {
        await createEmptyFile(fileName);
      } else {
        console.error('Please provide a valid file name.');
      }
    }else if (input.trim().startsWith('rn ')) {
      const [oldFileName, newFileName] = input.slice(3).trim().split(' ');
      if (oldFileName && newFileName) {
        await renameFile(oldFileName, newFileName);
      } else {
        console.error('Please provide both old and new file names.');
      }
    }else if (input.trim().startsWith('cp ')) {
      const args = input.slice(3).trim().split(' ');

      const fromPath = args[0];
      const toDirectory = args[1];

      if (fromPath && toDirectory) {
          try {
              await fs.promises.access(fromPath);

              await fs.promises.access(toDirectory);

              await copyFile(fromPath, toDirectory);
          } catch (error) {
              console.error(`Operation failed: ${error.message}`);
          }
      } else {
          console.error('Please provide both source and destination paths.');
      }
  } else if (input.trim().startsWith('mv ')) {
    const args = input.slice(3).trim().split(' ');

    const fromPath = args[0];
    const toDirectory = args[1];

    if (fromPath && toDirectory) {
        try {
            await fs.promises.access(fromPath);
            await fs.promises.access(toDirectory);
            const destinationPath = await moveFile(fromPath, toDirectory);
            console.log(`File moved to ${destinationPath}`);
        } catch (error) {
            console.error(`Operation failed: ${error.message}`);
        }
    } else {
        console.error('Please provide both source and destination paths.');
    }
}else if (input.trim().startsWith('rm ')) {
  const filePath = input.slice(3).trim();
  if (filePath) {
      await deleteFile(filePath);
  } else {
      console.error('Please provide a valid file path to delete.');
  }
}else if (input.trim().startsWith('os ')) {
  const args = input.split(' ').slice(1);
  if (args.length > 0) {
      await handleOsCommand(args);
  } else {
      console.error('Please provide a valid os command.');
  }
} else if (input.trim().startsWith('hash ')) {
  const filePath = input.slice(5).trim();
  if (filePath) {
      try {
          await fs.promises.access(filePath);
          const hash = await fileHash(filePath);
          console.log(`Hash of file "${filePath}": ${hash}`);
      } catch (error) {
          console.error(`Operation failed: ${error.message}`);
      }
  } else {
      console.error('Please provide a valid file path for hash calculation.');
  }
}else if (input.trim().startsWith('compress ')) {
  const args = input.slice(9).trim().split(' ');
  const inputFilePath = args[0];
  const outputDir = args[1];

  if (inputFilePath && outputDir) {
      try {
          await fs.promises.access(inputFilePath);
          await fs.promises.access(outputDir);

          const outputFilePath = path.join(outputDir, `${path.basename(inputFilePath)}.br`);

          try {
              await fs.promises.access(outputFilePath);
              console.error(`Error: Compressed file ${outputFilePath} already exists. Please choose a different name or location.`);
              return;
          } catch (error) {
              if (error.code !== 'ENOENT') {
                  throw error;
              }
          }

          await compressFile(inputFilePath, outputDir);
      } catch (error) {
          console.error(`Operation failed: ${error.message}`);
      }
  } else {
      console.error('Please provide both input and output file paths for compression.');
  }
} else if (input.trim().startsWith('decompress ')) {
  const args = input.slice(11).trim().split(' ');
  const inputFilePath = args[0];
  const outputDir = args[1];

  if (inputFilePath && outputDir) {
      try {
          await fs.promises.access(inputFilePath);
          await fs.promises.access(outputDir);

          const parsedPath = path.parse(inputFilePath);
          const outputFilePath = path.join(outputDir, `${parsedPath.name}_decompressed${parsedPath.ext.replace('.br', '')}`);


          try {
              await fs.promises.access(outputFilePath);
              console.error(`Error: Decompressed file ${outputFilePath} already exists. Please choose a different name or location.`);
              return;
          } catch (error) {
              if (error.code !== 'ENOENT') {
                  throw error;
              }
          }

          await decompressFile(inputFilePath, outputFilePath);
      } catch (error) {
          console.error(`Operation failed: ${error.message}`);
      }
  } else {
      console.error('Please provide both input and output file paths for decompression.');
  }
} else {
      throw new Error('Invalid command. Please use "up", "cd <path>",cat <filename>, add <filename>, or ".exit".');
    }
  } catch (error) {
    console.error(`Operation failed: ${error.message}`);
  } finally {
    promptUser();
  }
};

const usersInputReader =readline.createInterface({
  input:process.stdin,
  output:process.stdout
})

export const promptUser = () => {
   usersInputReader.question('Enter a command: ', async (input) => {
    await handleUserInput(input.trim());
});

};

promptUser();

process.on('SIGINT', () => {
    console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
    usersInputReader.close();
    process.exit(0);
});

usersInputReader.on('close', () => {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
    process.exit(0);
  });
