import { Message, Permissions } from 'discord.js';

import Command from '../Structures/Command';

export const isMessage = (message: Message): message is Message => {
  return !!message;
};

export const isCommand = (arr: Command | undefined): arr is Command => {
  return arr !== undefined;
};

export const isPermissions = (p: Readonly<Permissions> | string): p is Readonly<Permissions> => {
  return typeof p !== 'string';
};
