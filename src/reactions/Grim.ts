import * as eastasianwidth from 'eastasianwidth';
import { BotReaction } from '../Reaction';
import { random } from '../util/Random';
import { applyCacheBuster } from '../util/Url';

const strpad = (str: string, count: number): string =>
  new Array(count + 1).join(str);

export const reactions: Array<BotReaction> = [
  {
    pattern: /^zoi$|^ぞい$|がんばるぞい$|頑張るぞい$/i,
    reaction: async (send): Promise<void> => {
      const targets = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3];
      const selected = random(targets);
      const url = `http://yamiga.waka.ru.com/images/zoi${selected}.jpg`;
      await send(applyCacheBuster(url));
    },
    alsoNotMentioned: true,
    help: (b: string): string => `${b} zoi|ぞい - がんばるぞい`,
  },
  {
    pattern: /突然の (.+)$/i,
    reaction: async (send, matched: Array<string>): Promise<void> => {
      const text = matched[1].replace(/^\s+|\s+$/g, '');
      const length = Math.floor(eastasianwidth.length(text));
      const suddenDeath = [
        `＿${strpad('人', length + 2)}＿`,
        `＞ ${text} ＜`,
        `￣Y${strpad('^Y', length)}￣`,
      ].join('\n');
      await send(suddenDeath);
    },
    help: (b: string): string => `${b} 突然の 死 - 突然の死`,
  },
  {
    pattern: /選んで (.+)$/i,
    reaction: async (send, matched: Array<string>): Promise<void> => {
      const items = matched[1].split(/[・,、\s]+/);
      const selected = random(items);
      await send(`選ばれたのは "${selected}" でした。`);
    },
    help: (b: string): string =>
      `${b} 選んで A B C - 空白やカンマ区切りのなにかから1つを選んでくれる`,
  },
  {
    pattern: /月曜日だよ.*/i,
    reaction: async (send): Promise<void> => {
      await send('………….(返事がないただの屍のようだ');
    },
    help: (b: string): string =>
      `${b} 「月曜日だよ」って言うと真理を見せてくれる`,
  },
  {
    pattern: /金曜日だよ.*/i,
    reaction: async (send): Promise<void> => {
      await send(':mrtry: < 全員集合！！！！！！！！！！！！！！！１１１１１');
      await send(':jp_taku: < 集合しろよ！！！！');
      await send(':mrtry: < ごめんな');
    },
    help: (b: string): string =>
      `${b} 「金曜日だよ」って言うと盛り上げてくれる`,
  },
];
