const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('msg')
        .setDescription('Allows a specific user to pass a string for the bot to say')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message for the bot to say')
                .setRequired(true)),
    async execute(interaction) {
        const authorizedUserId = '600464355917692952';
        const message = interaction.options.getString('message');

        if (interaction.user.id === authorizedUserId/* || '830948578226339850'*/) {
            await interaction.reply({ content: 'Message sent!', ephemeral: true });
            await interaction.channel.send(message);
        } else {
            await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
        }
    },
};
