import Discord from 'discord.js';

import Client from './Client';

export enum CommandType {
  BOTH = 'BOTH',
  SLASH = 'SLASH',
  TEXT = 'TEXT',
}

interface CommandOptions {
  name: string;
  description: string;
  permission: Discord.PermissionString;
  type: CommandType | string;
  slashCommandOptions: Discord.ApplicationCommandOption[];
  run: (message: Discord.Message | Discord.CommandInteraction, args: string[], client: Client) => void;
}

class Command {
  name: string;
  description: string;
  permission: Discord.PermissionString;
  type: CommandType;
  slashCommandOptions: Discord.ApplicationCommandOption[];
  run: (message: Discord.Message | Discord.CommandInteraction, args: string[], client: Client) => void;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.permission = options.permission;
    this.type = ['BOTH', 'SLASH', 'TEXT'].includes(options.type) ? options.type as CommandType : CommandType.TEXT;
    this.slashCommandOptions = options.slashCommandOptions || [];
    this.run = options.run;
  }
}

export default Command;
