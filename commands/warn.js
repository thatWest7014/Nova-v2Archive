const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const { db, ref, get, update } = require('../src/firebase');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to warn')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the warning')
                .setRequired(true)),
    async execute(interaction) {
        try {
            console.log('Checking permissions...');
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            console.log('Fetching user and reason...');
            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const userId = user.id;
            const guildId = interaction.guildId;

            console.log(`User: ${userId}, Guild: ${guildId}, Reason: ${reason}`);
            
            const userWarningsRef = ref(db, `warnings/${userId}/${guildId}`);
            const snapshot = await get(userWarningsRef);

            let warnings = snapshot.exists() ? snapshot.val() : [];
            warnings.push({ reason, date: new Date().toISOString() });

            const updates = {};
            updates[`warnings/${userId}/${guildId}`] = warnings;

            console.log('Updating database...');
            await update(ref(db), updates);

            const publicEmbed = new EmbedBuilder()
                .setTitle('User Warned')
                .setColor(0xff0000)
                .setTimestamp()
                .setFooter({ text: 'Warnings' })
                .addFields(
                    { name: 'User', value: `${user.tag}`, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Date', value: new Date().toISOString(), inline: true }
                );

            await interaction.reply({ embeds: [publicEmbed], ephemeral: false });

            const privateEmbed = new EmbedBuilder()
                .setTitle('You have been warned')
                .setColor(0xff0000)
                .setTimestamp()
                .setFooter({ text: 'Warning' })
                .addFields(
                    { name: 'Reason', value: reason, inline: false }
                );

            try {
                await user.send({ embeds: [privateEmbed] });
            } catch (error) {
                console.error('Error sending DM to user:', error);
                // Optionally notify the command issuer that the DM could not be sent
                await interaction.followUp({ content: 'Warning sent, but failed to DM the user.', ephemeral: true });
            }

        } catch (error) {
            console.error('Error warning user:', error);
            await interaction.reply({ content: 'There was an error warning the user. Please try again later.', ephemeral: true });
        }
    },
};
