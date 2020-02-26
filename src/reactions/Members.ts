import { applyCacheBuster } from '../util/Url';
import { BotReaction } from '../Reaction';
import { random } from '../util/Random';

const gomas = [
  (): string =>
    applyCacheBuster('http://yamiga.waka.ru.com/images/goma/01.jpg'),
  (): string =>
    applyCacheBuster('http://yamiga.waka.ru.com/images/goma/02.jpg'),
  (): string =>
    applyCacheBuster('http://yamiga.waka.ru.com/images/goma/03.jpg'),
  (): string =>
    applyCacheBuster('http://yamiga.waka.ru.com/images/goma/04.jpg'),
  (): string =>
    applyCacheBuster('http://yamiga.waka.ru.com/images/goma/05.jpg'),
  (): string =>
    '```\n　　　CH \n　　　／＼ \n　　／　＼＼ \nHC／　　　＼＼CH \n ｜｜C6H6　　｜ \n ｜｜　´д｀｜ \nHC＼　　　／／CH \n　　＼　／／ \n　　　＼／ \n　　　CH\n```',
];
const isaos = [
  (): string =>
    applyCacheBuster(
      'https://36.media.tumblr.com/3df68abdd9a1eb7a0fbda4dacb9930af/tumblr_ns5chdb0Vm1un4u6lo1_1280.jpg',
      '#',
    ),
  (): string =>
    applyCacheBuster(
      'https://camo.githubusercontent.com/4a011f97909b89a26822ee21e921eb7012e9df18/68747470733a2f2f34302e6d656469612e74756d626c722e636f6d2f31346231333736396364336238303235623163653338626238626238626261352f74756d626c725f6e75313538697269536c31756e3475366c6f315f313238302e6a7067',
    ),
  (): string =>
    applyCacheBuster(
      'https://68.media.tumblr.com/b167d3c40341868491fc56266994b24a/tumblr_oibhhjbqwM1un4u6lo1_400.gif',
      '#',
    ),
  (): string =>
    applyCacheBuster(
      'https://68.media.tumblr.com/76e4c36e209a9709f1e66831f8c78d97/tumblr_oo2ynnnv3x1un4u6lo1_400.gif',
      '#',
    ),
];

const kirins = [
  (): string => ':kirin: 「名言 :ha: :tsukureru: 」',
  (): string =>
    applyCacheBuster(
      'https://78.media.tumblr.com/285789508369fafedf077149d14cbb40/tumblr_ozeltfR7SE1wi2duuo1_1280.png',
    ),
  (): string =>
    applyCacheBuster(
      'https://78.media.tumblr.com/48b7fb2197972dbf5962c6ce4896e12c/tumblr_ozemn25ogo1r4buwio1_1280.png',
    ),
  (): string => applyCacheBuster('https://togetter.com/li/1224842'),
];

const tries = [
  (): string =>
    applyCacheBuster('https://cdn.hotolab.net/images/lgtm_mrtry.gif'),
];

const papixes = [(): string => ':papicent: 「強いbotはprettierを捨てる」'];

export const reactions: Array<BotReaction> = [
  {
    pattern: /GOMA/i,
    reaction: async (send): Promise<void> => {
      send(random(gomas)());
    },
    help: (b: string): string => `${b} goma - やればわかる`,
  },
  {
    pattern: /ISAO/i,
    reaction: async (send): Promise<void> => {
      send(random(isaos)());
    },
    help: (b: string): string => `${b} isao - やればわかる`,
  },
  {
    pattern: /KIRIN (\d+)$/i,
    reaction: async (send, matched: Array<string>): Promise<void> => {
      const n = matched[1];
      const x = parseFloat(n);
      const y = x / 140000;
      send(`${n}円は${y}きりん`);
    },
    help: (b: string): string =>
      `${b} kirin 140000 - 1きりんは・・・ ref: https://togetter.com/li/1224842 `,
  },
  {
    pattern: /KIRIN$/i,
    reaction: async (send): Promise<void> => {
      send(random(kirins)());
    },
    help: (b: string): string => `${b} kirin - やればわかる`,
  },
  {
    pattern: /(MRTRY|TRY)/i,
    reaction: async (send): Promise<void> => send(random(tries)()),
    help: (b: string): string => `${b} try|mrtry - やればわかる`,
  },
  {
    pattern: /PAPIX/i,
    reaction: async (send): Promise<void> => send(random(papixes)()),
    help: (b: string): string => `${b} papix - やればわかる`,
  },
  {
    pattern: /^5000兆円欲しい$/,
    reaction: async (send): Promise<void> =>
      send(':5: :0: :0sono1: :0sono2: :chou: :en: :ho: :shi: :ii:'),
    alsoNotMentioned: true,
  },
];
