import { quote } from '@discordjs/builders';
import axios from 'axios';

import Event from '../Structures/Event';
import User, { UserDocument } from '../Models/User';

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

  const authorId = message.author.id;

  let user: UserDocument & { _id: any; } | null;
  try {
    user = await User.findOne({ userId: authorId });
    if (!user) {
      // creating new user
      user = new User({ userId: authorId, goalsStreak: 1 });
      user.save();
    } else {
      // updating user streak
      const now = new Date();
      const diffInMilliSeconds = now.getTime() - user.updatedAt.getTime();
      const hours = Math.floor(diffInMilliSeconds / 36e5);
      if (hours >= 20) {
        user.goalsStreak++;
        await user.save();
      }
    }
  } catch (err) {
    console.log('Unable to get user:', err);
  }

  getQuote()
    .then((res: quote) => {
      const motivationChannel = client.channels.cache.find((c) => c.id == '913350444489773097');
      if (motivationChannel && motivationChannel.isText()) {
        motivationChannel.send(`<@${authorId}> You're on a ${user?.goalsStreak} day streak 🔥\n${res.q} -${res.a}`);
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
