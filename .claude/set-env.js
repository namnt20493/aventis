const { execSync } = require('child_process');
const fs = require('fs');

// Configuration - update this path to your .claude/.env file location
const envFilePath = process.argv[2] || '.env';

// Read and parse .env file
function parseEnvFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const variables = {};

    content.split('\n').forEach(line => {
        // Skip comments and empty lines
        if (line.startsWith('#') || !line.trim()) return;

        const match = line.match(/^([^=]+)=["']?(.+?)["']?$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            variables[key] = value;
        }
    });

    return variables;
}

// Set environment variable permanently (Windows User-level)
function setEnvVariable(key, value) {
    try {
        // Use single quotes inside PowerShell command
        const command = `[System.Environment]::SetEnvironmentVariable('${key}', '${value}', 'User')`;
        execSync(`powershell -Command "${command}"`, { stdio: 'inherit' });
        console.log(`✓ Set ${key}`);
    } catch (error) {
        console.error(`✗ Failed to set ${key}: ${error.message}`);
    }
}

// Main
try {
    console.log(`Reading from: ${envFilePath}\n`);
    const variables = parseEnvFile(envFilePath);

    console.log('Setting environment variables...\n');
    for (const [key, value] of Object.entries(variables)) {
        setEnvVariable(key, value);
    }

    console.log('\n✓ Done! Restart your terminal/VS Code to apply changes.');
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
