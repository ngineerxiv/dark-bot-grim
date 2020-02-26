import { App as SlackApp } from '@slack/bolt';

export class Timeline {
  readonly timelineChannelID: string;
  readonly blackListChannelIDs: Array<string>;
  private usersCache: Map<string, User>;

  constructor(timeline: string, blackList: Array<string>) {
    this.timelineChannelID = timeline;
    this.blackListChannelIDs = blackList;
    this.usersCache = new Map();
  }

  apply(app: SlackApp): void {
    app.event(
      'message',
      async ({ event, context }): Promise<void> => {
        if (this.blackListChannelIDs.includes(event.channel)) {
          return;
        }
        if (!event.channel.startsWith('C')) {
          return;
        }

        if (event.subtype === 'message_deleted') {
          // TODO
          return;
        }

        if (event.subtype !== undefined) {
          // TODO
          // @see https://api.slack.com/events/message
          return;
        }

        if (event.edited !== undefined) {
          // TODO
          return;
        }

        let user = this.usersCache.get(event.user);
        if (user === undefined) {
          this.usersCache = await this.fetchUsers(app);
          user = this.usersCache.get(event.user);
          if (user === undefined) {
            throw new Error(`User is not found. id = ${event.user}`);
          }
        }

        /* eslint-disable @typescript-eslint/camelcase */
        app.client.chat.postMessage({
          token: context.botToken,
          channel: this.timelineChannelID,
          text: `${event.text} (at <#${event.channel}>)`,
          username: user.name,
          as_user: false,
          icon_url: user.profile,
          link_names: false,
        });
        /* eslint-enable @typescript-eslint/camelcase */
      },
    );
  }

  private async fetchUsers(app: SlackApp): Promise<Map<string, User>> {
    const users = await app.client.users.list();
    if (!users.ok) {
      throw new Error(users.error);
    }
    const members: Array<SlackUser> = users.member as Array<SlackUser>;
    return new Map(
      members.map((m): [string, User] => {
        return [
          m.id,
          {
            id: m.id,
            name: m.name,
            profile: m.profile.image_48,
          },
        ];
      }),
    );
  }
}

interface User {
  id: string;
  name: string;
  profile: string;
}

interface SlackUser {
  id: string;
  name: string;
  profile: {
    image_48: string;
  };
}
