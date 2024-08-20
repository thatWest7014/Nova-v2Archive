const { SlashCommandBuilder, ActivityType } = require('discord.js');
const axios = require('axios');

const allowedUserId = '600464355917692952'; // Replace with your user ID
const statusPageApiKey = '0e94c87553074d66a1491d91bdb691f7'; // Replace with your API key
const pageId = '266y9bdyj6sf'; // Replace with your page ID
const itemId = 'wjcm5tc61y85'; // Replace with your component ID

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maint')
        .setDescription('Set the bot to maintenance mode. [BOT OWNER]'),
    async execute(interaction) {
        if (interaction.user.id !== allowedUserId) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        try {
            await interaction.reply('Setting bot to maintenance mode.');

            // Set bot presence
            interaction.client.user.setPresence({
                activities: [{
                    name: 'Maintenance',
                    type: ActivityType.Watching
                }],
                status: 'dnd'
            });

            // Update Statuspage component to 'under_maintenance'
            await axios({
                method: 'patch',
                url: `https://api.statuspage.io/v1/pages/${pageId}/components/${itemId}`,
                headers: {
                    'Authorization': `OAuth ${statusPageApiKey}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    component: {
                        status: 'under_maintenance'
                    }
                }
            });

            await interaction.followUp('Bot is now in maintenance mode and Statuspage component has been updated.');
            process.exit(0);
        } catch (error) {
            console.error('Error setting maintenance mode:', error);
            await interaction.reply({ content: 'There was an error. Please try again later.', ephemeral: true });
        }
    },
};
