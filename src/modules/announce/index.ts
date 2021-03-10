import { Client } from 'discord.js';
import { onMessage } from './onMessage';
import { onVoiceStateUpdate } from './onVoiceStateUpdate';

export const setup = (app: Client) => {
  app.on('message', onMessage(app));
  app.on("voiceStateUpdate", onVoiceStateUpdate(app));
}