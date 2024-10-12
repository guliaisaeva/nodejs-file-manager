import os from 'node:os';
let currentDirectory = process.cwd();

export const getHomeDirectory = () => os.homedir();
export const getCurrentDirectory = () => process.cwd();

export const displayCurrentDirectory = (directory) => {
    console.log(`You are currently in: ${directory}`);
};

