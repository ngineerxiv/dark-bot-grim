import { applyCacheBuster } from "./util/Url";

export type BotReaction = (
  messageSend: (message: string) => void,
  matched: Array<string>
) => Promise<void>;

export type Help = (bot: string) => string;

export const MentionedReactions: Array<[RegExp, BotReaction, Help?]> = (() => {
  const r: Array<[RegExp, BotReaction, Help?]> = [
    [
      /PING/i,
      async send => {
        const p = applyCacheBuster("http://yamiga.waka.ru.com/images/ping.jpg");
        send(p);
      },
      b => `${b} ping - ハローハロー`
    ]
  ];

  r.push([
    /HELP$/i,
    async messageSend => {
      const botName = "@grim";
      const helps = r.map(v => v[2]).filter(v => v !== undefined);
      const message = "\n" + helps.map(h => h(botName)).join("\n");
      messageSend(message);
    }
  ]);
  return r;
})();
