import { init as slackInit } from './Slack';

function main(): void {
  const slackBotToken = process.env.SLACK_BOT_TOKEN;
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
  const port = process.env.PORT || '8080';

  slackInit(slackBotToken, slackSigningSecret, port).catch(e => {
    console.error(`Slack Error`);
    console.error(e);
  });
  console.log(`Slack Event Application started with port ${port}`);
}

main();
