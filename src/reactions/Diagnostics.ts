import { BotReaction } from '../Reaction';
import { HelloHello } from '../domains/B';

export const reactions: Array<BotReaction> = [
  {
    pattern: /PING/i,
    reaction: async (send): Promise<void> => {
      send(HelloHello);
    },
    help: (b: string): string => `${b} ping - ハローハロー`,
  },
];
