import {
  App,
  directMention,
  Middleware,
  SlackEventMiddlewareArgs,
  MessageEvent,
  MessageDeletedEvent,
} from '@slack/bolt';
import { Reactions } from './Reaction';

import { Notification } from './slack/Notifications';
import { SlackClientImpl, SlackClient } from './slack/SlackClient';
import { TimelineRepositoryOnMemory } from './slack/TimelineRepository';
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
      return notification.notifyNewEmoji(event.name);
    },
  );
}

function initTimeline(app: App, env: Env, slackClient: SlackClient): void {
  const blackList =
    env.slackTimelineBlackList === null
      ? []
      : env.slackTimelineBlackList.split(',').map(x => x.trim());
  const timeline = new TimelineService(
    env.slackTimelinePostTo,
    blackList,
    slackClient,
    new TimelineRepositoryOnMemory(),
  );
  app.event(
    'message',
    async ({
      event,
    }: {
      event: MessageEvent | MessageDeletedEvent;
    }): Promise<void> => {
      timeline.apply(event);
    },
  );
}

function initSlackOnlyFunction(app: App): void {
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
}

export async function init(env: Env): Promise<unknown> {
  const app = new App({
    token: env.slackBotToken,
    signingSecret: env.slackSigningSecret,
  });
  const slackClient = new SlackClientImpl(app, env.slackBotToken);

  Reactions.forEach(v => {
    const listeners: Array<Middleware<SlackEventMiddlewareArgs<'message'>>> =
      v.alsoNotMentioned ?? false ? [] : [directMention()];
    listeners.push(async ({ context, say }) => {
      const matched = context.matches;
      v.reaction((m: string) => say(m), matched === null ? [] : matched);
    });
    app.message(v.pattern, ...listeners);
  });

  initSlackOnlyFunction(app);
  initNotification(app, env, slackClient);
  if (env.slackTimelinePostTo !== null) {
    initTimeline(app, env, slackClient);
  }

  app.error(e => {
    console.error(e);
  });
  return await app.start(env.port);
}
