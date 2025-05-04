import os from 'node:os';
export const getHomeDirectory = () => os.homedir();
export const getCurrentDirectory = () => process.cwd();

export const displayCurrentDirectory = () => {
    const currentDirectory = getCurrentDirectory();
    console.log(`You are currently in: ${currentDirectory}`);
};


export const handleOsCommand = async (args) => {
    const command = args[0];
    switch (command) {
        case '--EOL':
            console.log(`Default system EOL: ${JSON.stringify(os.EOL)}`);
            break;
        case '--cpus':
            const cpus = os.cpus();
            console.log(`Total CPUs: ${cpus.length}`);
            cpus.forEach((cpu, index) => {
                console.log(`CPU ${index + 1}: Model - ${cpu.model}, Clock Speed - ${(cpu.speed / 1000).toFixed(2)} GHz`);
            });
            break;
        case '--homedir':
            console.log(`Home directory: ${os.homedir()}`);
            break;
        case '--username':
            console.log(`Current user name: ${os.userInfo().username}`);
            break;
        case '--architecture':
            console.log(`CPU Architecture: ${os.arch()}`);
            break;
        default:
            console.error('Invalid OS command. Please use --EOL, --cpus, --homedir, --username, or --architecture.');
            break;
    }
};