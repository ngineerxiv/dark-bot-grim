import { BotReaction } from '../Reaction';
import { random } from '../util/Random';

export const reactions: Array<BotReaction> = [
  {
    pattern: /選んで (.+)$/i,
    reaction: async (send, matched: Array<string>): Promise<void> => {
      const items = matched[1].split(/[・,、\s]+/);
      const selected = random(items);
      send(`選ばれたのは "${selected}" でした。`);
    },
    help: (b: string): string =>
      `${b} 選んで A B C - 空白やカンマ区切りのなにかから1つを選んでくれる`,
  },
];
