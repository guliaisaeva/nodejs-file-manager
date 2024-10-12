import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {getUserName}from "../user/user.js"


const userName = getUserName();
const homeDirectory = os.homedir();
let currentDirectory = process.cwd();
console.log(`Welcome to the File Manager, ${userName}!`);
console.log(`Starting working directory is: ${homeDirectory}`);


const displayCurrentDirectory = () => {
  console.log(`You are currently in: ${currentDirectory}`);
};
  const usersInputReader =readline.createInterface({
    input:process.stdin,
    output:process.stdout
  })

const handleUserInput = async (input) => {
  try {
    console.log();
      if (input === 'up') {
          goUp();
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
      }
  } catch (error) {
      console.error(`Operation failed: ${error.message}`);
  }
  console.log();
};

const promptUser = () => {
  displayCurrentDirectory() ;
   usersInputReader.question('Enter a command: ', async (input) => {
    await handleUserInput(input.trim());
    promptUser();
});
};
const goUp = () => {
  const parentDirectory = path.dirname(currentDirectory);
  if (parentDirectory !== currentDirectory) {
      currentDirectory = parentDirectory;
      console.log(`Moved up to: ${currentDirectory}`);
  } else {
      console.log('You are already at the root directory.');
  }
};

const changeDirectory = (targetPath) => {
  let resolvedPath;

  if (path.isAbsolute(targetPath)) {
    resolvedPath = targetPath;
  } else {
    resolvedPath = path.resolve(currentDirectory, targetPath);
  }

  fs.access(resolvedPath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if (err) {
      console.error(`Operation failed: Directory "${targetPath}" does not exist.`);
    } else {
      const isRoot = resolvedPath === path.parse(resolvedPath).root;
      if (isRoot && resolvedPath !== homeDirectory) {
        console.log('You are already at the root directory.');
      } else {
        currentDirectory = resolvedPath;
        console.log(`Changed directory to: ${currentDirectory}`);
      }
    }
  });
};
// const listDirectoryContents = () => {
//   fs.readdir(currentDirectory, { withFileTypes: true }, (err, files) => {
//     if (err) {
//       console.error(`Operation failed: ${err.message}`);
//       return;
//     }

//     const fileDetails = files.map(file => {
//       return {
//         name: file.name,
//         type: file.isDirectory() ? 'directory' : 'file',
//       };
//     });

//     // Sort by type first (directories first) then by name
//     fileDetails.sort((a, b) => {
//       if (a.type === b.type) {
//         return a.name.localeCompare(b.name);
//       }
//       return a.type === 'directory' ? -1 : 1;
//     });

//     console.log('\n(index)\tName\t\tType');
//     fileDetails.forEach((file, index) => {
//       console.log(`\t${index}\t${file.name}\t${file.type}`);
//     });
//   });
// };

const listDirectoryContents = () => {
  fs.readdir(currentDirectory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Operation failed: ${err.message}`);
      return;
    }

    const fileDetails = files.map(file => {
      return {
        name: file.name,
        type: file.isDirectory() ? 'directory' : 'file',
      };
    });

    fileDetails.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });

    const maxNameLength = Math.max(...fileDetails.map(file => file.name.length), 4);
    console.log('\n(index)\t' + 'Name'.padEnd(maxNameLength) + '\tType');
    console.log('-'.repeat(20 + maxNameLength));

    fileDetails.forEach((file, index) => {
      console.log(`\t${index}\t${file.name.padEnd(maxNameLength)}\t${file.type}`);
    });
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