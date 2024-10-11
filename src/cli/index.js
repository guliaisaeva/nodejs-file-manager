import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline';


const args = process.argv;
const getUserName = () => {
    const userNameArg = args.find(arg => arg.startsWith('--username='));
    if (userNameArg) {
      const username = userNameArg.split('=').slice(1).join('=').trim();
      if (!username) {
        const userNameArgIndex = args.indexOf(userNameArg);
        return args[userNameArgIndex + 1] ? args[userNameArgIndex + 1].trim() : "No Name User";
      }
      return username;
    }
    return process.env.npm_config_username || "No Name User";
  };

  const userName = getUserName()
  console.log(`Welcome to the File Manager, ${userName}!`);


  const usersInputReader =readline.createInterface({
    input:process.stdin,
    output:process.stdout
  })

  usersInputReader.on('line', (input) => {
    if (input.trim() === '.exit') {
      console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
      process.exit(0);
    } else {
      console.log(`You entered: ${input}`);

    }
  });

process.on('SIGINT', () => {
    console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
    inputReader.close();
    process.exit(0);
});

usersInputReader.on('close', () => {
    console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
    process.exit(0);
  });