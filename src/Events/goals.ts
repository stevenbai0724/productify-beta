import { quote } from '@discordjs/builders';
import axios from 'axios';
import { TextChannel } from 'discord.js';

import Event from '../Structures/Event';

interface quote {
  q: string;
  a: string;
  h: string;
}

const getQuote = async () => {
  const quoteArr: quote[] = (await axios.get('https://zenquotes.io/api/random')).data;
  const quote = quoteArr[0];
  return quote;
};

const Goals = new Event('messageCreate', async (client, message) => {
  if (message.author.bot) return;
  if (message.channelId != '911033664496861234') return; // goals channel
  // if (message.channelId != '908105673831768084') return; // moderators channel

  getQuote()
    .then((res: quote) => {
      const motivationChannel = client.channels.cache.find((c) => c.id == '913350444489773097');
      if (motivationChannel && motivationChannel.isText()) {
        motivationChannel.send(`<@${message.author.id}> ${res.q} -${res.a}`);
      } else {
        console.log('Unable to send message to user in motivation channel');
      }
    })
    .catch((err: string) => {
      console.log('Unable to retreive quote:', err);
    });

  try {
    await message.react('💯');
    await message.react('908492212139094027');
    await message.react('908492210679455786');
  } catch (error) {
    console.error('One of the emojis failed to react:', error);
  }
});

module.exports = Goals;
