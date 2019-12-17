import { BotReaction } from '../Reaction';
import { applyCacheBuster } from '../util/Url';

export const reactions: Array<BotReaction> = [
  {
    pattern: /PING/i,
    reaction: async send => {
      const p = applyCacheBuster('http://yamiga.waka.ru.com/images/ping.jpg');
      send(p);
    },
    help: b => `${b} ping - ハローハロー`,
  },
];
