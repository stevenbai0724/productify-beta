import Discord from 'discord.js';

import Command, { CommandType } from '../Structures/Command';

const Embed = new Command({
  name: 'embed',
  description: 'Embeds a message',
  type: CommandType.BOTH,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    const embed = new Discord.MessageEmbed();

    const user = message instanceof Discord.CommandInteraction ? message.user : message.author;

    embed
      .setTitle('Test Embed')
      .setURL('https://prepanywhere.com')
      .setAuthor(user.username, <string>user.avatarURL({ dynamic: true }), 'https://prepanywhere.com')
      .setDescription('This is some plain text,\n Link: [test](https://prepanywhere.com)')
      .setColor('BLURPLE')
      .setThumbnail(<string>user.avatarURL({ dynamic: true }))
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
});

module.exports = Embed;
