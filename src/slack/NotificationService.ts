import { SlackClient } from './SlackClient';

export class Notification {
  readonly newChannel: string;
  readonly newEmoji: string;
  readonly teamJoined: string;
  readonly slackClient: SlackClient;
  constructor(
    newChannel: string,
    newEmoji: string,
    teamJoined: string,
    slackClient: SlackClient,
  ) {
    this.newChannel = newChannel;
    this.newEmoji = newEmoji;
    this.teamJoined = teamJoined;
    this.slackClient = slackClient;
  }

  async notifyNewChannel(
    channelId: string,
    channelName: string,
  ): Promise<void> {
    if (!channelId.startsWith('C')) {
      return;
    }
    await this.slackClient.postMessage({
      channel: this.newChannel,
      text: `新しいチャンネルが作られたみたいだお <#${channelId}|${channelName}>`,
      userName: 'yaruo',
      iconEmoji: ':yaruo:',
    });
    return;
  }

  async notifyTeamJoin(id?: string): Promise<void> {
    const text =
      id === undefined
        ? `Welcome to underground ...\npublicチャンネルは <#C0MHAJD7X> に流れるからそこで気になったチャンネルにはいると良いお\nその他にもおすすめ貼っとくお https://github.com/ngineerxiv/dark/blob/master/%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB.md`
        : `Hi <@${id}> Welcome to underground ...\npublicチャンネルは <#C0MHAJD7X> に流れるからそこで気になったチャンネルにはいると良いお\nその他にもおすすめ貼っとくお https://github.com/ngineerxiv/dark/blob/master/%E3%81%8A%E3%81%99%E3%81%99%E3%82%81%E3%83%81%E3%83%A3%E3%83%B3%E3%83%8D%E3%83%AB.md`;
    await this.slackClient.postMessage({
      channel: this.teamJoined,
      text: text,
      userName: 'yaruo',
      iconEmoji: ':yaruo:',
    });
    return;
  }

  async notifyNewEmoji(emojiName: string): Promise<void> {
    await this.slackClient.postMessage({
      channel: this.newEmoji,
      text: `新しい絵文字が作られたみたいだお :${emojiName}:`,
      userName: 'yaruo',
      iconEmoji: ':yaruo:',
    });
    return;
  }
}
