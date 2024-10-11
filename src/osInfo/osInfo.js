import os from 'node:os';

export const getHomeDirectory = () => os.homedir();
export const getCurrentDirectory = () => process.cwd();

export const displayCurrentDirectory = (directory) => {
    console.log(`You are currently in: ${directory}`);
};


