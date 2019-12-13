import { App, directMention } from "@slack/bolt";
import { MentionedReactions } from "./Reaction";

export async function init(
  botToken: string,
  signingSecret: string,
  eventPort: string
): Promise<unknown> {
  const app = new App({
    token: botToken,
    signingSecret: signingSecret
  });

  app.error(e => {
    console.error(e);
  });

  MentionedReactions.forEach(v => {
    const [re, func, _] = v;
    app.message(re, directMention(), async ({ context, say }) => {
      const matched = context.matched;
      func((m: string) => say(m), matched === null ? [] : matched);
    });
  });
  return await app.start(eventPort);
}
