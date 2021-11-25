import Event from '../Structures/Event';

import { isCommand, isPermissions } from '../Utils/predicates';

const InteractionCreate = new Event('interactionCreate', (client, interaction) => {
  if (interaction.user.bot || !interaction.isCommand() || !interaction.guild) return;

  const command = client.commands.find((cmd) => cmd.name.toLowerCase() == interaction.commandName);

  const args = isCommand(command) && [
    interaction.commandName,
    ...command.slashCommandOptions.map((v) => `${interaction.options.get(v.name)?.value}`),
  ];

  if (!args) return interaction.reply('That is not a valid command!');

  const permissions = interaction.member.permissions;

  const permission = isPermissions(permissions) && permissions.has(command.permission);

  if (!permission) {
    return interaction.reply('You do not have the correct permissions to run this command!');
  }

  command.run(interaction, args, client);
});

export default InteractionCreate;
