import Discord from 'discord.js';

import Client from './Client';

type runFunction<K extends keyof Discord.ClientEvents> = (
  client: Client,
  ...eventArgs: Discord.ClientEvents[K]
) => void;

class Event<K extends keyof Discord.ClientEvents> {
  event: K;
  run: runFunction<K>;

  constructor(event: K, runFunction: runFunction<K>) {
    this.event = event;
    this.run = runFunction;
  }
}

export default Event;
