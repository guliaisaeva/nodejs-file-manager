import readline from 'node:readline';
import {getUserName}from "../user/user.js"
import { getHomeDirectory, getCurrentDirectory,displayCurrentDirectory ,changeDirectory } from '../osInfo/osInfo.js';



const userName = getUserName();
console.log(`Welcome to the File Manager, ${userName}!`);


let currentDirectory = getCurrentDirectory();
const homeDirectory = getHomeDirectory();
console.log(`Starting working directory is: ${homeDirectory}`);
displayCurrentDirectory(currentDirectory);


  const usersInputReader =readline.createInterface({
    input:process.stdin,
    output:process.stdout
  })

//   const handleUserInput = (input) => {
//     const args = input.trim().split(' ');
//     const command = args[0];

//     switch (command) {
//         case 'cd':
//             if (args[1]) {
//                 currentDirectory = changeDirectory(currentDirectory, args[1]);
//             } else {
//                 console.log('Please provide a directory name.');
//             }
//             break;
//         case 'ls':
//             listFiles(currentDirectory);
//             break;
//         case 'add':
//             if (args[1]) {
//                 createFile(currentDirectory, args[1]);
//             } else {
//                 console.log('Please provide a file name.');
//             }
//             break;
//         case '.exit':
//             console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
//             process.exit(0);
//             break;
//         default:
//             console.log(`Unknown command: ${command}`);
//             break;
//     }

//     displayCurrentDirectory(currentDirectory);
// };


//   usersInputReader.on('line', handleUserInput);
usersInputReader.on('line', (input) => {
    if (input.trim() === '.exit') {
        console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
        process.exit(0);
    } else {
        console.log(`You entered: ${input}`);
        displayCurrentDirectory(currentDirectory);
    }
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