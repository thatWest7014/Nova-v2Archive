const { SlashCommandBuilder } = require('discord.js');

const allowedUserId = '600464355917692952'; // Replace with your user ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('estop')
        .setDescription('E-Stop for the entire bot. [BOT OWNER]'),
    async execute(interaction) {
        if (interaction.user.id !== allowedUserId) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        try {
            await interaction.reply('Exiting Node.js Process Globally.');
            process.exit(0); // Exits the node process
        } catch (error) {
            console.error('Error formatting database:', error);
            await interaction.reply({ content: 'There was an error. Please try again later.', ephemeral: true });
        }
    },
};
