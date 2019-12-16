import { BotReactionPattern } from "../Reaction";
import { applyCacheBuster } from "../util/Url";

export const reactions: Array<BotReactionPattern> = [
  [
    /PING/i,
    async send => {
      const p = applyCacheBuster("http://yamiga.waka.ru.com/images/ping.jpg");
      send(p);
    },
    b => `${b} ping - ハローハロー`
  ]
];
