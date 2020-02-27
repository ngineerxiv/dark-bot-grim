import { App as SlackApp } from '@slack/bolt';
import { MessageID, SlackUser, User } from './Domain';

export interface SlackClient {
  fetchUsers(): Promise<Map<string, User>>;

  postMessage(arg: {
    channel: string;
    text: string;
    userName: string;
    iconUrl?: string;
    iconEmoji?: string;
  }): Promise<MessageID>;

  deleteMessage(channel: string, ts: string): Promise<void>;
}

export class SlackClientImpl implements SlackClient {
  readonly app: SlackApp;
  readonly token: string;
  constructor(app: SlackApp, botToken: string) {
    this.app = app;
    this.token = botToken;
  }

  async fetchUsers(): Promise<Map<string, User>> {
    const users = await this.app.client.users.list({
      token: this.token,
    });
    if (!users.ok) {
      throw new Error(users.error);
    }
    const members: Array<SlackUser> = users.members as Array<SlackUser>;
    return new Map(
      members.map((m): [string, User] => {
        return [
          m.id,
          {
            id: m.id,
            name: m.name,
            profile: m.profile.image_48,
            isBot: m.is_bot,
          },
        ];
      }),
    );
  }
  async postMessage(arg: {
    channel: string;
    text: string;
    userName: string;
    iconUrl?: string;
    iconEmoji?: string;
  }): Promise<MessageID> {
    /* eslint-disable @typescript-eslint/camelcase */
    let icon = {};
    if (arg.iconUrl !== undefined) {
      icon = {
        icon_url: arg.iconUrl,
      };
    }
    if (arg.iconEmoji !== undefined) {
      icon = {
        icon_emoji: arg.iconEmoji,
      };
    }
    const response = await this.app.client.chat.postMessage({
      token: this.token,
      channel: arg.channel,
      text: arg.text,
      username: arg.userName,
      as_user: false,
      link_names: false,
      ...icon,
    });
    /* eslint-enable @typescript-eslint/camelcase */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message: any = response.message;
    return message.ts;
  }

  async deleteMessage(channel: string, ts: string): Promise<void> {
    await this.app.client.chat.delete({
      token: this.token,
      channel: channel,
      ts: ts,
    });
    return;
  }
}
