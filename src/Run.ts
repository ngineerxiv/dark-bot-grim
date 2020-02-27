import { init as slackInit } from './Slack';
import { env, validateEnv } from './Env';
import * as redis from 'redis';

async function main(): Promise<void> {
  await validateEnv(env);
  const redisClient = redis.createClient(env.redisUrl);
  redisClient.on('error', err => {
    console.error(err);
  });
  await slackInit(env.slackBotToken, env.slackSigningSecret, env.port);
  console.log(`Slack Event Application started with port ${env.port}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
