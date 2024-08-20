const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

const allowedGuildId = '1225142849922928661';
const targetChannelId = '1231745115165556746';
const checkEmojiId = '1260642779214647306'; // Replace with the ID of the :Check: emoji

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tryout')
        .setDescription('Schedule a tryout')
        .addStringOption(option => 
            option.setName('datetime')
                .setDescription('Day and time of the tryout')
                .setRequired(true)),
    async execute(interaction) {
        const guildId = interaction.guildId;
        const user = interaction.user;
        const dateTime = interaction.options.getString('datetime');

        // Check if the command is being used in the allowed guild
        if (guildId !== allowedGuildId) {
            await interaction.reply({ content: 'This command can only be used in QHDG.', ephemeral: true });
            return;
        }

        // Check if the user has the required permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const tryoutEmbed = new EmbedBuilder()
            .setColor(0x3072c7)
            .setTitle('Tryout Notice.')
            .setDescription(`A tryout has been scheduled by ${user.tag}.`)
            .addFields(
                { name: 'Date and Time', value: dateTime },
                { name: 'Dress Code:', value: 'The dress code is that all items must be removed on your avatar. Including faces and clothing items.' },
                { name: 'Additional Info:', value: 'We reserve the right to blacklist you as we see fit.' },
                { name: 'Attendance:', value: 'The location will be given when the tryout begins. To attend, react to this message.' }
            )
            .setTimestamp();

        const channel = interaction.guild.channels.cache.get(targetChannelId);

        if (!channel) {
            await interaction.reply({ content: 'The specified channel does not exist.', ephemeral: true });
            return;
        }

        try {
            const announcementMessage = await channel.send('<@&1233926379012100137>');
            const embedMessage = await channel.send({ embeds: [tryoutEmbed] });
            await embedMessage.react(checkEmojiId);
            await interaction.reply({ content: 'Tryout has been scheduled.', ephemeral: true });
        } catch (error) {
            console.error('Error sending message:', error);
            await interaction.reply({ content: 'There was an error scheduling the tryout. Please try again later.', ephemeral: true });
        }
    },
};
