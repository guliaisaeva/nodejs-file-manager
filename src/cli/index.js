import readline from 'node:readline';
import {getUserName}from "../user/user.js"
import { getHomeDirectory,displayCurrentDirectory,getCurrentDirectory  } from '../osInfo/osInfo.js';
// import {handleUserInput} from "../navigation/navCommands.js"


const userName = getUserName();
const homeDirectory = getHomeDirectory();

console.log(`Welcome to the File Manager, ${userName}!`);
console.log(`Starting working directory is: ${homeDirectory}`);



  const usersInputReader =readline.createInterface({
    input:process.stdin,
    output:process.stdout
  })

  const displayCurrentPath = () => {
      const currentDirectory = getCurrentDirectory();
      displayCurrentDirectory(currentDirectory); }

displayCurrentPath();
usersInputReader.on('line', async(input) => {
    if (input.trim() === '.exit') {
        console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
        process.exit(0);
    } else {
        console.log(`You entered: ${input}`);
        // await handleUserInput(input)
        displayCurrentPath();   }
});

process.on('SIGINT', () => {
    console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
    usersInputReader.close();
    process.exit(0);
});

usersInputReader.on('close', () => {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
    process.exit(0);
  });