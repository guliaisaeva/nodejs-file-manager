import readline from 'node:readline';
import {getUserName}from "../user/user.js";
import { homeDirectory,displayCurrentDirectory,goUp,changeDirectory,listDirectoryContents} from '../directories/directory.js';
import path from 'node:path';
import {read} from "../fs/read.js";
import {createEmptyFile} from "../fs/create.js";
import  {renameFile} from "../fs/rename.js";


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
    }   else {
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
//   const filePath = path.join(process.cwd(), 'src/fs/files/fileToRead.txt');
// readFileContent(filePath);