import { applyCacheBuster } from '../util/Url';
import { BotReaction } from '../Reaction';
import { random } from '../util/Random';

const materia = [
  (): string => '黒マテリア',
  (): string => '黒マテリア',
  (): string => '黒マテリア',
  (): string => '黒マテリア',
  (): string => '黒マテリア',
  (): string => '黒マテリア',
  (): string => 'メテオ呼ぶ',
  (): string => 'メテオ呼ぶ',
  (): string => 'メテオ呼ぶ',
  (): string => applyCacheBuster('http://yamiga.waka.ru.com/images/cloud.jpg'),
  (): string => applyCacheBuster('http://yamiga.waka.ru.com/images/cloud.jpg'),
  (): string => applyCacheBuster('http://yamiga.waka.ru.com/images/cloud.jpg'),
  (): string => 'ックパッド',
];

export const reactions: Array<BotReaction> = [
  {
    pattern: /((く|ク)(っ|ッ){0,1}){3}(\.|。|・)*$/i,
    reaction: async (send): Promise<void> => {
      send(random(materia)());
    },
    alsoNotMentioned: true,
    help: (b: string): string => `${b} ping - ハローハロー`,
  },
];
