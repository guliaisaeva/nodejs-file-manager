import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { promptUser } from '../cli/index.js';

export const homeDirectory = os.homedir();
export let currentDirectory = process.cwd();

export const displayCurrentDirectory = () => {
    console.log(`You are currently in: ${currentDirectory}`);
  };

export const goUp = () => {
    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory !== currentDirectory) {
        currentDirectory = parentDirectory;
        console.log(`Moved up to: ${currentDirectory}`);
    } else {
        console.log('You are already at the root directory.');
    }
  };

  export const changeDirectory = async (targetPath) => {
    try {
        let resolvedPath;
        if (path.isAbsolute(targetPath)) {
            resolvedPath = targetPath;
        } else {
            resolvedPath = path.resolve(currentDirectory, targetPath);
        }

        await fs.access(resolvedPath);

        const isRoot = resolvedPath === path.parse(resolvedPath).root;
        if (isRoot && resolvedPath !== homeDirectory) {
            console.log('You are already at the root directory.');
        } else {
            currentDirectory = resolvedPath;
            console.log(`Changed directory to: ${currentDirectory}`);
        }
    } catch (err) {
        console.error(`Operation failed: Directory "${targetPath}" does not exist.`);
    }
    console.log();
    promptUser();
};

export const listDirectoryContents = async () => {
    try {
        const files = await fs.readdir(currentDirectory, { withFileTypes: true });

        const fileDetails = files.map(file => ({
            name: file.name,
            type: file.isDirectory() ? 'directory' : 'file',
        }));

        fileDetails.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            return a.type === 'directory' ? -1 : 1;
        });

        const maxNameLength = Math.max(...fileDetails.map(file => file.name.length), 4);
        const indexColumnWidth = 5;
        const typeColumnWidth = 10;

        const tableHeader = `│ ${'Index'.padEnd(indexColumnWidth)} │ ${'Name'.padEnd(maxNameLength)} │ ${'Type'.padEnd(typeColumnWidth)} │`;
        const separator = `├${'─'.repeat(indexColumnWidth + 2)}┼${'─'.repeat(maxNameLength + 2)}┼${'─'.repeat(typeColumnWidth + 2)}┤`;

        console.log('\n' + tableHeader);
        console.log(separator);

        fileDetails.forEach((file, index) => {
            console.log(`│ ${index.toString().padEnd(indexColumnWidth)} │ ${file.name.padEnd(maxNameLength)} │ ${file.type.padEnd(typeColumnWidth)} │`);
        });

        console.log(`└${'─'.repeat(indexColumnWidth + 2)}┴${'─'.repeat(maxNameLength + 2)}┴${'─'.repeat(typeColumnWidth + 2)}┘`);
    } catch (err) {
        console.error(`Operation failed: ${err.message}`);
    }

    promptUser();
};
