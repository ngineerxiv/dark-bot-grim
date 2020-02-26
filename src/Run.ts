import { init as slackInit } from './Slack';
import { env, validateEnv } from './Env';

function main(): void {
  validateEnv(env);
  slackInit(env.slackBotToken, env.slackSigningSecret, env.port).catch(e => {
    console.error(`Slack Error`);
    console.error(e);
  });
  console.log(`Slack Event Application started with port ${env.port}`);
}

main();
