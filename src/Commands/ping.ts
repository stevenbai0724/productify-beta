import Discord from 'discord.js';

import Command, { CommandType } from '../Structures/Command';

const Ping = new Command({
  name: 'ping',
  description: "Shows the bot's pinng",
  type: CommandType.BOTH,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    const m = await message.reply(`Ping: ${client.ws.ping} ms.`);

    const msg =
      message instanceof Discord.CommandInteraction ? <Discord.Message>await message.fetchReply() : <Discord.Message>m;

    msg.edit(`Ping: ${client.ws.ping} ms.\n Message Ping: ${msg.createdTimestamp - message.createdTimestamp}`);
  },
});

export default Ping;
