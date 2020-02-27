import { MessageEvent, MessageDeletedEvent } from '@slack/bolt';
import { SlackClient, User } from './SlackClient';

class Message {
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

interface DeletedMessage {
  channel: string;
  deletedTs: MessageID;
}

interface TimelineRepository {
  put(m: Required<Message>): void;

  fetch(id: MessageID): Required<Message> | null;

  delete(id: MessageID): void;
}

export class TimelineRepositoryOnMemory implements TimelineRepository {
  readonly data: Map<MessageID, Required<Message>>;

  constructor() {
    this.data = new Map();
  }

  put(m: Required<Message>): void {
    this.data.set(m.ts, m);
  }
  fetch(id: MessageID): Required<Message> | null {
    const m = this.data.get(id);
    return m === undefined ? null : m;
  }
  delete(id: MessageID): void {
    this.data.delete(id);
  }
}

export class Timeline {
  readonly timelineChannelID: string;
  readonly blackListChannelIDs: Array<string>;
  readonly timelineRepository: TimelineRepository;
  readonly slackClient: SlackClient;
  private usersCache: Map<string, User>;

  constructor(
    timeline: string,
    blackList: Array<string>,
    slackClient: SlackClient,
    timelineRepository: TimelineRepository,
  ) {
    this.timelineChannelID = timeline;
    this.blackListChannelIDs = blackList;
    this.slackClient = slackClient;
    this.timelineRepository = timelineRepository;
    this.usersCache = new Map();
  }

  // FIXME @slack/boltに依存しない形にしてテストしたい
  async apply(event: MessageEvent | MessageDeletedEvent): Promise<void> {
    switch (event.subtype) {
      case 'message_deleted':
        this.deleteMessage({
          channel: event.channel,
          deletedTs: event.deleted_ts,
        });
        break;
      case undefined:
        this.postMessage(
          new Message(event.channel, event.user, event.text, event.ts),
        );
        break;
      default:
        console.info(`Not handled subtype. ${event.subtype}`);
        break;
    }
  }

  private async deleteMessage(m: DeletedMessage): Promise<void> {
    if (m.channel === this.timelineChannelID) {
      return;
    }
    const message = this.timelineRepository.fetch(m.deletedTs);
    if (message === null) {
      // TODO logger
      console.info(`Message Not Found. ts = ${m.deletedTs}`);
      return;
    }

    await this.slackClient.deleteMessage(
      this.timelineChannelID,
      message.timelineMessageTs,
    );
    this.timelineRepository.delete(message.ts);
    return;
  }

  private async postMessage(message: Message): Promise<void> {
    if (message.isBlackListed(this.blackListChannelIDs)) {
      return;
    }
    if (message.isPrivate()) {
      return;
    }

    if (message.isSameChannel(this.timelineChannelID)) {
      return;
    }

    const user = await this.fetchUser(message.user);

    if (user.isBot) {
      return;
    }

    const messageId = await this.slackClient.postMessage(
      this.timelineChannelID,
      `${message.text} (at <#${message.channel}>)`,
      user.name,
      user.profile,
    );

    this.timelineRepository.put(message.withId(messageId));
  }

  private async fetchUser(id: string): Promise<User> {
    let user = this.usersCache.get(id);
    if (user === undefined) {
      this.usersCache = await this.slackClient.fetchUsers();
      user = this.usersCache.get(id);
      if (user === undefined) {
        throw new Error(`User is not found. id = ${id}`);
      }
    }
    return user;
  }
}
