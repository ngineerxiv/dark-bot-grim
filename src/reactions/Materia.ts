import { applyCacheBuster } from '../util/Url';
import { BotReaction } from '../Reaction';
import { random } from '../util/Random';

const materia = [
  () => '黒マテリア',
  () => '黒マテリア',
  () => '黒マテリア',
  () => '黒マテリア',
  () => '黒マテリア',
  () => '黒マテリア',
  () => 'メテオ呼ぶ',
  () => 'メテオ呼ぶ',
  () => 'メテオ呼ぶ',
  () => applyCacheBuster('http://yamiga.waka.ru.com/images/cloud.jpg'),
  () => applyCacheBuster('http://yamiga.waka.ru.com/images/cloud.jpg'),
  () => applyCacheBuster('http://yamiga.waka.ru.com/images/cloud.jpg'),
  () => 'ックパッド',
];

export const reactions: Array<BotReaction> = [
  {
    pattern: /((く|ク)(っ|ッ){0,1}){3}(\.|。|・)*$/i,
    reaction: async send => {
      send(random(materia)());
    },
    alsoNotMentioned: true,
    help: b => `${b} ping - ハローハロー`,
  },
];
