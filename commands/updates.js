const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

const sourceGuildId = '1225142849922928661';
const sourceChannelId = '1260235433372155934';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updates')
        .setDescription('Set a channel to follow the announcement channel from the source guild.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to follow the announcement channel.')
                .setRequired(true)),
    async execute(interaction) {
        const targetGuildId = interaction.guildId;

        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const targetChannel = interaction.options.getChannel('channel');

        try {
            // Get the client
            const client = interaction.client;

            // Fetch the source guild and source channel
            const sourceGuild = await client.guilds.fetch(sourceGuildId);
            const sourceChannel = await sourceGuild.channels.fetch(sourceChannelId);

            if (!sourceChannel) {
                await interaction.reply({ content: 'The source announcement channel does not exist.', ephemeral: true });
                return;
            }

            // Create a webhook in the target channel and follow the source announcement channel
            const webhook = await targetChannel.createWebhook('Updates Webhook', {
                avatar: client.user.displayAvatarURL(),
            });

            await webhook.follow(sourceChannelId);

            await interaction.reply({ content: `The channel ${targetChannel} is now following the announcement channel from the source guild.`, ephemeral: true });
        } catch (error) {
            console.error('Error handling updates command:', error);
            await interaction.reply({ content: 'There was an error setting up the channel to follow the announcement channel. Please try again later.', ephemeral: true });
        }
    },
};
