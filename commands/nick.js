const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Set the bot\'s nickname in the guild')
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('The new nickname for the bot')
                .setRequired(true)),
    async execute(interaction) {
        const nickname = interaction.options.getString('nickname');
        const member = interaction.guild.members.cache.get(interaction.client.user.id);

        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        try {
            await member.setNickname(nickname);
            await interaction.reply(`Bot's nickname has been changed to "${nickname}".`);
        } catch (error) {
            console.error('Error setting bot nickname:', error);
            await interaction.reply('There was an error setting the bot\'s nickname. Please try again later.');
        }
    },
};
