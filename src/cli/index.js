import os from 'node:os';
import path from 'node:path';


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

//   const UsersInput =readLine.cre