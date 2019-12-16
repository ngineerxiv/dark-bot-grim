import {
  App,
  directMention,
  Middleware,
  SlackEventMiddlewareArgs
} from "@slack/bolt";
import { Reactions } from "./Reaction";

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

  Reactions.forEach(v => {
    const listeners: Array<Middleware<SlackEventMiddlewareArgs<"message">>> =
      v.alsoNotMentioned ?? false ? [] : [directMention()];
    listeners.push(async ({ context, say }) => {
      const matched = context.matches;
      v.reaction((m: string) => say(m), matched === null ? [] : matched);
    });
    app.message(v.pattern, ...listeners);
  });
  return await app.start(eventPort);
}
