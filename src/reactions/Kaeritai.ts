import { BotReaction } from "../Reaction";
import { applyCacheBuster } from "../util/Url";

export const reactions: Array<BotReaction> = [
  {
    pattern: /^すごい[！!]{2,}/,
    reaction: async send => {
      send(
        applyCacheBuster("https://pbs.twimg.com/media/C920YtzVwAAQZvX.jpg", "#")
      );
    },
    alsoNotMentioned: true
  },
  {
    pattern: /遅刻/,
    reaction: async send => {
      send(
        applyCacheBuster("https://pbs.twimg.com/media/C8wtqyoVYAAx5br.jpg", "#")
      );
    },
    alsoNotMentioned: true
  },
  {
    pattern: /^帰る[！!]*$/,
    reaction: async send => {
      send(
        applyCacheBuster("https://pbs.twimg.com/media/C9HxdfrVYAA-Dth.jpg", "#")
      );
    },
    alsoNotMentioned: true
  }
];
