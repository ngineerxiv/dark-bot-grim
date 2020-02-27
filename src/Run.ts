import { init as slackInit } from './Slack';
import { env, validateEnv } from './Env';
import * as redis from 'redis';

async function main(): Promise<void> {
  await validateEnv(env);
  await slackInit(env);
  console.log(`Slack Event Application started with port ${env.port}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
