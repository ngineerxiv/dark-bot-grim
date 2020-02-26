import { BotReaction } from '../Reaction';
import { applyCacheBuster } from '../util/Url';

export const reactions: Array<BotReaction> = [
  {
    pattern: /PING/i,
    reaction: async (send): Promise<void> => {
      const p = applyCacheBuster('http://yamiga.waka.ru.com/images/ping.jpg');
      send(p);
    },
    help: (b: string): string => `${b} ping - ハローハロー`,
  },
];
