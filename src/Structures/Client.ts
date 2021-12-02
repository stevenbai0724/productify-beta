import fs from 'fs';
import path from 'path';

import Discord from 'discord.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Command from './Command';
import Event from './Event';

const intents = new Discord.Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']);

class Client extends Discord.Client {
  commands: Discord.Collection<string, Command>;
  readonly prefix: string;

  constructor() {
    super({ intents });
    this.commands = new Discord.Collection();
    this.prefix = process.env.PREFIX!;
  }

  start(token: string) {
    // Initializing text commands
    const commandFiles = fs
      .readdirSync(path.join(__dirname, '..', 'Commands'))
      .filter((file) => /^.+(\.ts|\.js)$/.test(file));
    const commands: Command[] = commandFiles.map((file) => require(`../Commands/${file}`));

    commands.forEach((cmd) => {
      console.log(`Command ${cmd.name} loaded`);
      this.commands.set(cmd.name, cmd);
    });

    // Initialization slash commands
    const slashCommands = commands
      .filter((cmd) => ['BOTH', 'SLASH'].includes(cmd.type))
      .map((cmd) => ({
        name: cmd.name.toLowerCase(),
        description: cmd.description,
        permissions: [],
        options: cmd.slashCommandOptions,
        defaultPermission: true,
      }));

    this.removeAllListeners();

    // Ready event
    this.on('ready', async () => {
      try {
        await mongoose.connect(<string>process.env.MONGOOSE_URI);
        console.log('Successfully connected to MongoDB!');
      } catch (err) {
        console.log('Unable to connect to DB:', err);
      }

      const guild = this.guilds.cache.get(process.env.GUILD_ID ?? '');
      const cmds = guild
        ? await guild.commands.set(slashCommands)
        : await this.application?.commands.set(slashCommands);

      cmds?.forEach((cmd) => console.log(`Slash Command ${cmd.name} registered`));

      
      //INSERT RESPECTIVE ID'S 
      const roleId = "875135862214631424"; //role to ping every message send
      const channelId = "914245735829098506"; //channel to send periodic messages to
      const botId = "913587144805711892"; // ID of the bot sending periodic messages (productify)


      let channel = this.channels.cache.find(c => c.id === channelId) as Discord.TextChannel; 
      let sender = this.users.cache.find(user => user.id === `${botId}`) as Discord.User

      setInterval(() => {
        var d = new Date();
        var m = d.getMinutes();
        var s = d.getSeconds();
        const embedWork = new Discord.MessageEmbed();
        const embedBreak = new Discord.MessageEmbed();
        
        //embeded work message reminder
        embedWork
        .setTitle('Go to work!')
        .setDescription(`<@&${roleId}> your 5 minute break is over. Please remove all your distractions for the next 25 minutes and get to work. You can do it!`)
        .setColor('AQUA')
        .setAuthor(sender.username, <string>sender.defaultAvatarURL, 'https://prepanywhere.com')
        .setThumbnail("https://media.discordapp.net/attachments/802250402074591246/915062747069288478/worktime.png")
        .setTimestamp()

        //embeded break message reminder
        embedBreak
        .setTitle('Break time!')
        .setAuthor(sender.username, <string>sender.defaultAvatarURL, 'https://prepanywhere.com')
        .setDescription(`<@&${roleId}> you now have a 5 minute break for some mild relaxation. Please get up, stretch, and get some food/water. See you in 5 minutes. Great work!`)
        .setColor('RED')
        .setThumbnail("https://media.discordapp.net/attachments/802250402074591246/915062511022252032/breaktime.png")
        .setTimestamp();
        

        //return to work at 0th and 30th minute of every hour (once)
        if( (m == 0 || m == 30) && s == 2){
          channel.send({ embeds: [embedWork] });
        }
        //break at 25th and 55h minutes of every hour (once)
        if( (m == 25 || m == 55) && s == 2){  //extra 2 seconds compensates for discord / setInterval not syncing exactly 
          channel.send({ embeds: [embedBreak] });
        }

      },1000)
    });

    // Initialization events
    fs.readdirSync(path.join(__dirname, '..', 'Events'))
      .filter((file) => /^.+(\.ts|\.js)$/.test(file))
      .forEach((file) => {
        const eventObj: Event<keyof Discord.ClientEvents> = require(`../Events/${file}`);
        console.log(`Event ${eventObj.event} loaded`);
        this.on(eventObj.event, eventObj.run.bind(null, this));
      });

    this.login(token);
  }
}

export default Client;
