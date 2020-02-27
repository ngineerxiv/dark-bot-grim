export class Message {
  readonly channel: string;
  readonly user: string;
  readonly text: string;
  readonly ts: string;
  timelineMessageTs?: MessageID;

  constructor(channel: string, user: string, text: string, ts: string) {
    this.channel = channel;
    this.user = user;
    this.text = text;
    this.ts = ts;
  }

  isPrivate(): boolean {
    return !this.channel.startsWith('C');
  }

  isBlackListed(list: Array<string>): boolean {
    return list.includes(this.channel);
  }

  isSameChannel(timelineChannelID: string): boolean {
    return this.channel === timelineChannelID;
  }

  withId(id: MessageID): Required<Message> {
    this.timelineMessageTs = id;
    return this as Required<Message>;
  }
}

export type MessageID = string;

export interface DeletedMessage {
  channel: string;
  deletedTs: MessageID;
}

export interface User {
  id: string;
  name: string;
  profile: string;
  isBot: boolean;
}

export interface SlackUser {
  id: string;
  name: string;
  profile: {
    image_48: string;
  };
  is_bot: boolean;
}
