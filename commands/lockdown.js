const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Locks down all text channels where everyone can send messages in.')
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration for the lockdown (e.g., 60m for 60 minutes).')
                .setRequired(true)),
    async execute(interaction) {
        // Respond immediately to acknowledge the interaction
        await interaction.reply({ content: 'Lockdown is being applied...', ephemeral: true });

        const duration = interaction.options.getString('duration');
        const lockDuration = parseDuration(duration); // Parse the duration
        if (lockDuration === null) {
            return interaction.editReply({ content: 'Invalid duration format. Please use a format like 60m for 60 minutes.', ephemeral: true });
        }

        const guild = interaction.guild;
        // Filter to get only text channels where @everyone has SEND_MESSAGES permission
        const channels = guild.channels.cache.filter(c => c.isTextBased() &&
            c.permissionsFor(guild.roles.everyone).has(PermissionFlagsBits.SendMessages));

        if (channels.size === 0) {
            return interaction.editReply({ content: 'No text channels are available for lockdown where everyone can send messages.', ephemeral: true });
        }

        let successCount = 0;
        let failureCount = 0;

        for (const channel of channels.values()) {
            try {
                console.log(`Attempting to lock down channel: ${channel.name} (${channel.id})`);
                await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: false });
                successCount++;
                console.log(`Successfully locked down channel: ${channel.name} (${channel.id})`);
            } catch (error) {
                console.error(`Failed to update permissions for channel: ${channel.name} (${channel.id})`, error);
                failureCount++;
            }
        }

        setTimeout(async () => {
            for (const channel of channels.values()) {
                try {
                    console.log(`Attempting to restore permissions for channel: ${channel.name} (${channel.id})`);
                    await channel.permissionOverwrites.edit(guild.roles.everyone, { SendMessages: true });
                    console.log(`Successfully restored permissions for channel: ${channel.name} (${channel.id})`);
                } catch (error) {
                    console.error(`Failed to restore permissions for channel: ${channel.name} (${channel.id})`, error);
                }
            }
        }, lockDuration);

        return interaction.editReply({ 
            content: `Lockdown started for ${duration}. Successfully locked down ${successCount} channels. Failed to lock down ${failureCount} channels.`, 
            ephemeral: false 
        });
    }
};

// Function to parse duration strings like '60m', '2h', etc.
function parseDuration(duration) {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return null;
    }
}
