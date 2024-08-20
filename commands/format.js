const { SlashCommandBuilder } = require('discord.js');
const { getDatabase, ref, remove } = require('firebase/database'); // Ensure correct import

const allowedUserId = '600464355917692952'; // Replace with your user ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('format')
        .setDescription('Format the Firebase database'),
    async execute(interaction) {
        if (interaction.user.id !== allowedUserId) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        try {
            // Initialize the Firebase database
            const db = getDatabase();

            // Specify the path you want to format (delete all data under this path)
            const dbRef = ref(db, '/');
            await remove(dbRef);

            await interaction.reply('Firebase database has been formatted.');
        } catch (error) {
            console.error('Error formatting database:', error);
            await interaction.reply({ content: 'There was an error formatting the database. Please try again later.', ephemeral: true });
        }
    },
};
