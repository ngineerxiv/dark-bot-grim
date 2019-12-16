import { reactions as MemberReactions } from "./domains/Members";
import { reactions as DiagnosticsReactions } from "./domains/Diagnostics";

export type BotReaction = (
  messageSend: (message: string) => void,
  matched: Array<string>
) => Promise<void>;

export type Help = (bot: string) => string;

export type BotReactionPattern = [RegExp, BotReaction, Help?];

export const MentionedReactions: Array<BotReactionPattern> = (() => {
  const r: Array<BotReactionPattern> = [].concat(
    MemberReactions,
    DiagnosticsReactions
  );
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
