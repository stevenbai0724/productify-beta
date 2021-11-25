import Event from '../Structures/Event';
import { CommandType } from '../Structures/Command';

const MessageCreate = new Event('messageCreate', (client, message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(client.prefix)) return;

  const args = message.content.substring(client.prefix.length).split(/ +/);

  const command = client.commands.find((cmd) => cmd.name == args[0]);

  if (!command || ![CommandType.BOTH, CommandType.TEXT].includes(command.type)) {
    return message.reply('That command is only available via slash command!');
  }

  const permission = message.member?.permissions.has(command.permission, true);

  if (!permission) {
    return message.reply(`You do not have the permission \`${command.permission} ro run this command!`);
  }

  command.run(message, args, client);
});

export default MessageCreate;
