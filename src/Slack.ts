import {
  App,
  directMention,
  Middleware,
  SlackEventMiddlewareArgs,
  MessageEvent,
  MessageDeletedEvent,
} from '@slack/bolt';
import { Reactions } from './Reaction';

import { apply as SlackDirectMentioned } from './slack/DirectMentioned';
import { Notification } from './slack/Notifications';
import { env } from './Env';
import { Timeline, TimelineRepositoryOnMemory } from './slack/Timeline';
import { SlackClientImpl } from './slack/SlackClient';

export async function init(
  botToken: string,
  signingSecret: string,
  eventPort: string,
): Promise<unknown> {
  const app = new App({
    token: botToken,
    signingSecret: signingSecret,
  });

  app.error(e => {
    console.error(e);
  });

  Reactions.forEach(v => {
    const listeners: Array<Middleware<SlackEventMiddlewareArgs<'message'>>> =
      v.alsoNotMentioned ?? false ? [] : [directMention()];
    listeners.push(async ({ context, say }) => {
      const matched = context.matches;
      v.reaction((m: string) => say(m), matched === null ? [] : matched);
    });
    app.message(v.pattern, ...listeners);
  });

  SlackDirectMentioned(app);
  const notification = new Notification(
    env.slackNewChannelNotifyTo,
    env.slackNewEmojiNotifyTo,
    env.slackTeamJoinedNotifyTo,
  );
  notification.apply(app);

  if (env.slackTimelinePostTo !== null) {
    const blackList =
      env.slackTimelineBlackList === null
        ? []
        : env.slackTimelineBlackList.split(',').map(x => x.trim());
    const timeline = new Timeline(
      env.slackTimelinePostTo,
      blackList,
      new SlackClientImpl(app, env.slackBotToken),
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
  return await app.start(eventPort);
}
