export interface Env {
  slackBotToken: string;
  slackUserToken: string;
  slackSigningSecret: string;
  redisUrl: string;
  port: number;
  googleSearchCseId: string;
  googleSearchApiKey: string;
  slackNewChannelNotifyTo: SlackChannelId;
  slackNewEmojiNotifyTo: SlackChannelId;
  slackTeamJoinedNotifyTo: SlackChannelId;
  slackTimelinePostTo: SlackChannelId | null;
  slackTimelineBlackList: string | null;
  slackTeamDomain: string;
}

type SlackChannelId = string;

export const env: Env = {
  slackBotToken: process.env.SLACK_BOT_TOKEN,
  slackUserToken: process.env.SLACK_OAUTH_ACCESS_TOKEN,
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET,
  redisUrl: process.env.REDIS_URL,
  port: parseInt(process.env.PORT || '8080'),
  googleSearchCseId: process.env.GOOGLE_SEARCH_CSE_ID,
  googleSearchApiKey: process.env.GOOGLE_SEARCH_API_KEY,
  slackNewChannelNotifyTo: process.env.SLACK_NEW_CHANNEL,
  slackNewEmojiNotifyTo: process.env.SLACK_NEW_EMOJI,
  slackTeamJoinedNotifyTo: process.env.SLACK_TEAM_JOINED,
  slackTimelinePostTo: process.env.SLACK_TIMELINE || null,
  slackTimelineBlackList: process.env.SLACK_TIMELINE_BLACK_LIST || null,
  slackTeamDomain: process.env.SLACK_TEAM_DOMAIN,
};

export function validateEnv(env: Env): void {
  const keys = Object.keys(env) as (keyof Env)[];
  const notFoundKeys = keys
    .map((key) => {
      const value = env[key];
      // TODO when typeof value is object
      return value === undefined ? key : null;
    })
    .filter((x) => x !== null);
  if (notFoundKeys.length > 0) {
    throw new Error(`env is insufficient. key: ${notFoundKeys.join(', ')}`);
  }

  if (isNaN(env.port)) {
    throw new Error(`env.port is NaN.`);
  }
}
