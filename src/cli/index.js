import readline from 'node:readline';
import {getUserName}from "../user/user.js";
import { homeDirectory,currentDirectory,displayCurrentDirectory,goUp,changeDirectory,listDirectoryContents} from '../directories/directory.js';


const userName = getUserName();
console.log(`Welcome to the File Manager, ${userName}!`);
console.log(`Starting working directory is: ${homeDirectory}`);
displayCurrentDirectory();


const handleUserInput = async (input) => {
  try {
    console.log();
      if (input === 'up') {
          goUp();
          promptUser();

      } else if (input === '.exit') {
          console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
          process.exit(0);
      }
      else if (input.startsWith('cd ')) {
        const targetPath = input.slice(3).trim();
                changeDirectory(targetPath);

      }else if (input === 'ls') {
        listDirectoryContents();

      } else {
        throw new Error('Invalid command. Please use "up", "cd <path>", or ".exit".');
        promptUser();
      }
  } catch (error) {
      console.error(`Operation failed: ${error.message}`);
      promptUser();
  }
  console.log();
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