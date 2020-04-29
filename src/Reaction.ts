import { reactions as MemberReactions } from './reactions/Members';
import { reactions as DiagnosticsReactions } from './reactions/Diagnostics';
import { reactions as KaeritaiReactions } from './reactions/Kaeritai';
import { reactions as MateriaReactions } from './reactions/Materia';
import { reactions as GrimReactions } from './reactions/Grim';

export interface BotReaction {
  pattern: RegExp;
  reaction: (send: (m: string) => void, matched: Array<string>) => void;
  alsoNotMentioned?: boolean;
  help?: (bot: string) => string;
}

export const Reactions: Array<BotReaction> = ((): Array<BotReaction> => {
  const r: Array<BotReaction> = [].concat(
    MemberReactions,
    DiagnosticsReactions,
    MateriaReactions,
    KaeritaiReactions,
    GrimReactions,
  );
  r.push({
    pattern: /HELP$/i,
    reaction: async (messageSend) => {
      const botName = '@grim';
      const helps = r.map((v) => v.help).filter((v) => v !== undefined);
      const message = '\n' + helps.map((h) => h(botName)).join('\n');
      messageSend(message);
    },
  });
  return r;
})();
