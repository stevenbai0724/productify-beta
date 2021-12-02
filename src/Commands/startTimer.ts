import Discord from 'discord.js';

import Command, { CommandType } from '../Structures/Command';

const startTimer = new Command({
  name: 'start-timer',
  description: 'Starts a 25/5 pomodoro timer in the given channel',
  type: CommandType.SLASH,
  slashCommandOptions: [],
  permission: 'SEND_MESSAGES',
  run: async (message, args, client) => {
    const roleId = '915889536855326720';

    const channel = message.channel as Discord.TextBasedChannels;
    const sender = client.users.cache.find((user) => user.id === `${process.env.CLIENT_ID}`) as Discord.User;

    const embedWork = new Discord.MessageEmbed();
    const embedBreak = new Discord.MessageEmbed();

    //embeded work message reminder
    embedWork
      .setTitle('Time for work!')
      .setDescription(
        `I hope you enjoyed your break, but your homework isn't going to do itself! <:PandaLove:908492212659191888> Let's get that bread <:PandaCapitalist:908492210696224839>`
      )
      .setColor('AQUA')
      .setAuthor(sender.username, <string>sender.defaultAvatarURL, 'https://prepanywhere.com')
      .setThumbnail('https://media.discordapp.net/attachments/802250402074591246/915062747069288478/worktime.png')
      .setTimestamp();

    //embeded break message reminder
    embedBreak
      .setTitle('Break time!')
      .setAuthor(sender.username, <string>sender.defaultAvatarURL, 'https://prepanywhere.com')
      .setDescription(
        `<@&${roleId}> Great work so far <:PandaUmaru:908492212386541588> Feel free to stretch your muscles or take a much needed water break! See you in 5 minutes. <:PandaCuteJuice:908492211967111248>`
      )
      .setColor('ORANGE')
      .setThumbnail('https://media.discordapp.net/attachments/802250402074591246/915062511022252032/breaktime.png')
      .setTimestamp();

    const intervalTimer = setInterval(() => {
      const d = new Date();
      const m = d.getMinutes();

      //return to work at 0th and 30th minute of every hour (once)
      if (m == 0 || m == 30) {
        channel.send({ embeds: [embedWork] });
      }
      //break at 25th and 55h minutes of every hour (once)
      if (m == 25 || m == 55) {
        //extra 2 seconds compensates for discord / setInterval not syncing exactly
        channel.send({ embeds: [embedBreak] });
      }
    }, 6000);

    client.timers.set(channel.id, intervalTimer);
    message.reply({ content: 'Timer successfully added!', ephemeral: true });
  },
});

module.exports = startTimer;
