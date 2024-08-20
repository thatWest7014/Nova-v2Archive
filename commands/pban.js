const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pban')
        .setDescription('Permanently ban a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        const moderator = interaction.user;

        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        if (!member.bannable) {
            await interaction.reply({ content: 'I cannot ban this user. They might have higher permissions or be the server owner.', ephemeral: true });
            return;
        }

        try {
            const banReason = `Permanent ban issued by ${moderator.tag}`;

            // Send DM to the user
            try {
                await user.send(`You have been permanently banned from **${interaction.guild.name}**. Reason: ${banReason}`);
            } catch (err) {
                console.error('Error sending DM:', err);
            }

            // Ban the user
            await member.ban({ reason: banReason });

            await interaction.reply(`Successfully banned ${user.tag} permanently. Reason: ${banReason}`);
        } catch (error) {
            console.error('Error banning user:', error);
            await interaction.reply('There was an error banning the user. Please try again later.');
        }
    },
};
