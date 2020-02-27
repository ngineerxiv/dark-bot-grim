import { App as SlackApp } from '@slack/bolt';
import { MessageID } from './Timeline';

export interface User {
  id: string;
  name: string;
  profile: string;
  isBot: boolean;
}

interface SlackUser {
  id: string;
  name: string;
  profile: {
    image_48: string;
  };
  is_bot: boolean;
}

export interface SlackClient {
  fetchUsers(): Promise<Map<string, User>>;

  postMessage(
    channel: string,
    text: string,
    userName: string,
    iconUrl: string,
  ): Promise<MessageID>;

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
  async postMessage(
    channel: string,
    text: string,
    userName: string,
    iconUrl: string,
  ): Promise<MessageID> {
    /* eslint-disable @typescript-eslint/camelcase */
    const response = await this.app.client.chat.postMessage({
      token: this.token,
      channel: channel,
      text: text,
      username: userName,
      as_user: false,
      icon_url: iconUrl,
      link_names: false,
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
