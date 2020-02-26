import { App as SlackApp } from '@slack/bolt';

export class Notification {
  readonly newChannel: string;
  readonly newEmoji: string;
  readonly teamJoined: string;
  constructor(newChannel: string, newEmoji: string, teamJoined: string) {
    this.newChannel = newChannel;
    this.newEmoji = newEmoji;
    this.teamJoined = teamJoined;
  }

  /* eslint-disable @typescript-eslint/camelcase */
  apply(app: SlackApp): void {
    app.event(
      'channel_created',
      async ({ event, context }): Promise<void> => {
        if (!event.channel.id.startsWith('C')) {
          return;
        }
        await app.client.chat.postMessage({
          token: context.botToken,
          channel: this.newChannel,
          text: `新しいチャンネルが作られたみたいだお <#${event.channel.id}|${event.channel.name}>`,
          username: 'yaruo',
          as_user: false,
          icon_emoji: ':yaruo:',
        });
      },
    );

    app.event(
      'team_join',
      async ({ context, event }): Promise<void> => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user: any = event.user;
        const id = user.id;
        const text =
          id === undefined
            ? `Welcome to underground ...\npublicチャンネルは <#C0MHAJD7X> に流れるからそこで気になったチャンネルにはいると良いお\nその他にもおすすめ貼っとくお https://github.com/ngineerxiv/dark/blob/master/%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB.md`
            : `Hi <@${id}> Welcome to underground ...\npublicチャンネルは <#C0MHAJD7X> に流れるからそこで気になったチャンネルにはいると良いお\nその他にもおすすめ貼っとくお https://github.com/ngineerxiv/dark/blob/master/%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB.md`;

        await app.client.chat.postMessage({
          token: context.botToken,
          channel: this.teamJoined,
          text: text,
          username: 'yaruo',
          as_user: false,
          icon_emoji: ':yaruo:',
        });
      },
    );

    app.event(
      'emoji_changed',
      async ({ event, context }): Promise<void> => {
        if (event.subtype !== 'add') {
          return;
        }
        await app.client.chat.postMessage({
          token: context.botToken,
          channel: this.newEmoji,
          text: `新しい絵文字が作られたみたいだお :${event.name}:`,
          username: 'yaruo',
          as_user: false,
          icon_emoji: ':yaruo:',
        });
      },
    );
  }
  /* eslint-enable @typescript-eslint/camelcase */
}
