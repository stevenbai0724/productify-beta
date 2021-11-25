import { TextChannel } from 'discord.js';
import Client from '../Structures/Client';

import Command, { CommandType } from '../Structures/Command';

const Clear = new Command({
  name: 'clear',
  description: 'Clear an ammount of messages',
  type: CommandType.BOTH,
  slashCommandOptions: [
    {
      name: 'amount',
      description: 'The amount of messages to clear',
      type: 'INTEGER',
      required: true,
    },
  ],
  permission: 'MANAGE_MESSAGES',
  run: async (message, args, client) => {
    const amount = parseInt(args[1]);

    if (!amount || isNaN(amount)) {
      return message.reply(`${args[1]} is not a valid number!`);
    }

    if (amount > 100) return message.reply('You cannot clear more than 100 messages!');

    const channel = message.channel as TextChannel;

    await channel.bulkDelete(amount);

    try {
      const msg = await message.reply(`Cleared ${amount} messages!`);
      setTimeout(() => msg?.delete(), 5000);
    } catch(err) {}
  },
});

module.exports = Clear;
