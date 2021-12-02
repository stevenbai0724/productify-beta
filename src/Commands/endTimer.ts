import Discord from 'discord.js';

import Command, { CommandType } from '../Structures/Command';

const endTimer = new Command({
  name: 'end-timer',
  description: 'Ends a 25/5 pomodoro timer in this channel',
  type: CommandType.SLASH,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    const channelId = message.channelId;
    const intervalTimer = client.timers.get(channelId);

    if (!intervalTimer) {
      return message.reply({ content: 'No pomodoro timer exists in this channel!', ephemeral: true });
    }

    clearInterval(intervalTimer);
    client.timers.delete(channelId);
    return message.reply({ content: 'Timer successfully removed!', ephemeral: true });
  },
});

module.exports = endTimer;
