import { MessageEvent, Context } from '@slack/bolt';
import { SlackClient, User } from './SlackClient';

class Message {
  readonly channel: string;
  readonly user: string;
  readonly text: string;
  readonly ts: MessageID;

  constructor(e: MessageEvent, context: Context) {
    this.channel = context.channel;
    this.user = e.user;
    this.text = e.text;
    this.ts = e.ts;
  }

  isPrivate(): boolean {
    return !this.channel.startsWith('C');
  }

  isBlackListed(list: Array<string>): boolean {
    return list.includes(this.channel);
  }
}

type MessageID = string;

interface TimelineRepository {
  put(m: Message): void;

  fetch(id: MessageID): Message | null;

  delete(id: MessageID): void;
}

export class TimelineRepositoryOnMemory implements TimelineRepository {
  readonly data: Map<MessageID, Message>;

  constructor() {
    this.data = new Map();
  }

  put(m: Message): void {
    this.data.set(m.ts, m);
  }
  fetch(id: MessageID): Message | null {
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

  async apply(event: MessageEvent, context: Context): Promise<void> {
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

    const message = new Message(event, context);
    if (message.isBlackListed(this.blackListChannelIDs)) {
      return;
    }
    if (message.isPrivate()) {
      return;
    }

    let user = this.usersCache.get(event.user);
    if (user === undefined) {
      this.usersCache = await this.slackClient.fetchUsers();
      user = this.usersCache.get(event.user);
      if (user === undefined) {
        throw new Error(`User is not found. id = ${event.user}`);
      }
    }

    await this.slackClient.postMessage(
      context.botToken,
      this.timelineChannelID,
      `${event.text} (at <#${event.channel}>)`,
      user.name,
      user.profile,
    );

    this.timelineRepository.put(message);
  }
}
