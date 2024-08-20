const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping Pong!'),
    async execute(interaction) {
        await interaction.reply(`Pong! ${interaction.user.username}, You joined this Guild on ${interaction.member.joinedAt}`)
    }
}