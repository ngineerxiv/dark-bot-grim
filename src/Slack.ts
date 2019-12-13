import { App, directMention } from "@slack/bolt";

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

  app.message("ping", directMention(), ({ say }) => {
    say("pong");
  });
  return await app.start(eventPort);
}
