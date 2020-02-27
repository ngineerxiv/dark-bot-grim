import {
  App,
  directMention,
  Middleware,
  SlackEventMiddlewareArgs,
  MessageEvent,
  MessageDeletedEvent,
} from '@slack/bolt';
import * as redis from 'redis';
import { Reactions } from './Reaction';

import { Notification } from './slack/NotificationService';
import { SlackClientImpl, SlackClient } from './slack/SlackClient';
import { TimelineRepositoryOnRedis } from './slack/TimelineRepository';
import { TimelineService } from './slack/TimelineService';
import { Env } from './Env';

function initNotification(app: App, env: Env, slackClient: SlackClient): void {
  const notification = new Notification(
    env.slackNewChannelNotifyTo,
    env.slackNewEmojiNotifyTo,
    env.slackTeamJoinedNotifyTo,
    slackClient,
  );

  app.event(
    'channel_created',
    async ({ event }): Promise<void> => {
      return notification.notifyNewChannel(
        event.channel.id,
        event.channel.name,
      );
    },
  );

  app.event(
    'team_join',
    async ({ event }): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = event.user;
      return notification.notifyTeamJoin(user.id);
    },
  );

  app.event(
    'emoji_changed',
    async ({ event }): Promise<void> => {
      if (event.subtype !== 'add') {
        return;
      }
      return notification.notifyNewEmoji(event.name).catch(e => {
        // TODO sentry
        console.error('Error Occured in notification');
        console.error(e);
      });
    },
  );
}

function initTimeline(app: App, env: Env, slackClient: SlackClient): void {
  const redisClient = redis.createClient(env.redisUrl);
  redisClient.on('error', err => {
    console.error(err);
  });

  const blackList =
    env.slackTimelineBlackList === null
      ? []
      : env.slackTimelineBlackList.split(',').map(x => x.trim());
  const timeline = new TimelineService(
    env.slackTimelinePostTo,
    blackList,
    slackClient,
    new TimelineRepositoryOnRedis(redisClient),
  );
  app.event(
    'message',
    async ({
      event,
    }: {
      event: MessageEvent | MessageDeletedEvent;
    }): Promise<void> => {
      timeline.apply(event).catch(e => {
        // TODO sentry
        console.error('Error Occured in timeline');
        console.error(e);
      });
    },
  );
}

function initSlackOnlyFunction(app: App, env: Env): void {
  app.message(
    /channel$|チャンネル$/,
    ...[
      directMention(),
      async ({
        event,
        say,
      }: SlackEventMiddlewareArgs<'message'>): Promise<void> => {
        say(`ここのチャンネルIDは ${event.channel}`);
      },
    ],
  );

  app.message(
    /joinall$/,
    ...[
      directMention(),
      async ({ say }: SlackEventMiddlewareArgs<'message'>): Promise<void> => {
        const channelsResponse = await app.client.conversations.list({
          token: env.slackBotToken,
        });
        const channels = channelsResponse.channels as {
          id: string;
          name: string;
          is_channel: boolean;
          is_archived: boolean;
          is_member: boolean;
        }[];
        const notMember = channels.filter(
          x => !x.is_member && !x.is_archived && x.is_channel,
        );
        if (notMember.length === 0) {
          say(`入っていないチャンネルはないよ`);
          return;
        }

        const cs = notMember.map(x => x.name).join(', ');
        say(`入っていないチャンネルは${cs}なので入っていくよ`);
        notMember.forEach(async c => {
          await app.client.conversations.join({
            token: env.slackBotToken,
            channel: c.id,
          });
        });
      },
    ],
  );
}

export async function init(env: Env): Promise<unknown> {
  const app = new App({
    token: env.slackBotToken,
    signingSecret: env.slackSigningSecret,
  });
  const slackClient = new SlackClientImpl(app, env.slackUserToken);

  Reactions.forEach(v => {
    const listeners: Array<Middleware<SlackEventMiddlewareArgs<'message'>>> =
      v.alsoNotMentioned ?? false ? [] : [directMention()];
    listeners.push(async ({ context, say }) => {
      const matched = context.matches;
      v.reaction((m: string) => say(m), matched === null ? [] : matched);
    });
    app.message(v.pattern, ...listeners);
  });

  initSlackOnlyFunction(app, env);
  initNotification(app, env, slackClient);
  if (env.slackTimelinePostTo !== null) {
    initTimeline(app, env, slackClient);
  }

  app.error(e => {
    console.error(e);
  });
  return await app.start(env.port);
}
