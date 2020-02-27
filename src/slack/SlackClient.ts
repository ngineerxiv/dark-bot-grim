import { App as SlackApp } from '@slack/bolt';

export interface User {
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

export interface SlackClient {
  fetchUsers(): Promise<Map<string, User>>;

  postMessage(
    token: string,
    channel: string,
    text: string,
    userName: string,
    iconUrl: string,
  ): Promise<void>;
}

export class SlackClientImpl implements SlackClient {
  readonly app: SlackApp;
  constructor(app: SlackApp) {
    this.app = app;
  }

  async fetchUsers(): Promise<Map<string, User>> {
    const users = await this.app.client.users.list();
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
  async postMessage(
    token: string,
    channel: string,
    text: string,
    userName: string,
    iconUrl: string,
  ): Promise<void> {
    /* eslint-disable @typescript-eslint/camelcase */
    await this.app.client.chat.postMessage({
      token: token,
      channel: channel,
      text: text,
      username: userName,
      as_user: false,
      icon_url: iconUrl,
      link_names: false,
    });
    /* eslint-enable @typescript-eslint/camelcase */

    return;
  }
}
