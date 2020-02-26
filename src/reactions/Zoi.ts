import { BotReaction } from '../Reaction';
import { random } from '../util/Random';
import { applyCacheBuster } from '../util/Url';

export const reactions: Array<BotReaction> = [
  {
    pattern: /[^zoi$|^ぞい$|がんばるぞい$|頑張るぞい$]/i,
    reaction: async (send): Promise<void> => {
      const targets = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3];
      const selected = random(targets);
      const url = `http://yamiga.waka.ru.com/images/zoi${selected}.jpg`;
      send(applyCacheBuster(url));
    },
    alsoNotMentioned: true,
    help: (b: string): string => `${b} zoi|ぞい - がんばるぞい`,
  },
];
