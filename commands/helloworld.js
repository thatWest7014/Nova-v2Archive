const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('helloworld')
        .setDescription('Replies with Hello, World!'),
    async execute(interaction) {
        await interaction.reply('Hello, World!');
    },
};
