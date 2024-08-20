const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const clientId = '1253920141901693008'; // Your client ID
const token = 'No'; // Your bot token

const commandsPath = path.join(__dirname, '..', 'commands'); // Adjust path to point to ../commands
console.log('Commands directory path:', commandsPath); // Log the path for verification

try {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = [];
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(clientId), // Register commands globally
                { body: commands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
} catch (err) {
    console.error('Error reading commands directory:', err);
}
