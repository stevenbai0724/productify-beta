import fs from 'fs';

import Discord from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

import Command from './Command';
import Event from './Event';

const intents = new Discord.Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']);

class Client extends Discord.Client {
  commands: Discord.Collection<string, Command>;
  prefix: string;

  constructor() {
    super({ intents });
    this.commands = new Discord.Collection();
    this.prefix = process.env.PREFIX!;
  }

  start(token: string) {
    // Initializing text commands
    const commandFiles = fs.readdirSync('./src/Commands').filter((file) => /^.+(\.ts|\.js)$/.test(file));
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
      const guild = this.guilds.cache.get(process.env.GUILD_ID ?? '');
      const cmds = guild ? await guild.commands.set(slashCommands) : await this.application?.commands.set(slashCommands);

      cmds?.forEach((cmd) => console.log(`Slash Command ${cmd.name} registered`));
    });

    // Initialization events
    fs.readdirSync('./src/Events')
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
