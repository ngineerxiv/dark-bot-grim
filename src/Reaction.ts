type BotReaction = (
  messageSend: (message: string) => void,
  matched: Array<string>
) => Promise<void>;

type Help = string;

export const MentionedReactions: Array<[RegExp, BotReaction, Help?]> = (() => {
  const botName = "@grim"; // TODO get from slack app
  const r: Array<[RegExp, BotReaction, Help?]> = [
    [
      /PING/i,
      async send => {
        send("PONG");
      },
      `${botName} ping - pong`
    ]
  ];

  r.push([
    /HELP$/i,
    async messageSend => {
      const helps = r.map(v => v[2]).filter(v => v !== undefined);
      const message = "\n" + helps.join("\n");
      messageSend(message);
    }
  ]);
  return r;
})();
