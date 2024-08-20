const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete the last specified number of messages')
        .addIntegerOption(option => 
            option.setName('num')
                .setDescription('Number of messages to delete')
                .setRequired(true)),
    async execute(interaction) {
        const numMessages = interaction.options.getInteger('num');

        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        // Check if the number of messages to delete is valid
        if (numMessages < 1 || numMessages > 100) {
            await interaction.reply({ content: 'Please specify a number between 1 and 100.', ephemeral: true });
            return;
        }

        try {
            // Fetch and delete the messages
            const fetched = await interaction.channel.messages.fetch({ limit: numMessages });
            await interaction.channel.bulkDelete(fetched);

            await interaction.reply({ content: `Successfully deleted ${numMessages} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error deleting messages:', error);
            await interaction.reply('There was an error deleting the messages. Please try again later.');
        }
    },
};
