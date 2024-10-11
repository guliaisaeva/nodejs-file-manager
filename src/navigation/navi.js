import fs from 'node:fs';
import path from 'node:path';

const navigateUp = (currentDir) => {
    const parentDir = path.resolve(currentDir, '..');
    return parentDir !== currentDir ? parentDir : currentDir; // Prevent going above root
};

const changeDirectory = (currentDir, targetDir) => {
    const newDir = path.resolve(currentDir, targetDir);
    if (fs.existsSync(newDir) && fs.lstatSync(newDir).isDirectory()) {
        return newDir;
    } else {
        console.log('Operation failed: Directory does not exist.');
        return currentDir;
    }
};
