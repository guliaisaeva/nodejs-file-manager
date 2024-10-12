import os from 'node:os';
let currentDirectory = process.cwd();

export const getHomeDirectory = () => os.homedir();
export const getCurrentDirectory = () => process.cwd();

export const displayCurrentDirectory = () => {
    const currentDirectory = getCurrentDirectory();
    console.log(`You are currently in: ${currentDirectory}`);
};

