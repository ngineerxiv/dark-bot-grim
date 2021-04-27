import { SlackClient } from './SlackClient';
import { TimelineRepository } from './TimelineRepository';
import { Message, DeletedMessage, User } from './Domain';
import {
  GenericMessageEvent,
  MessageDeletedEvent,
  MessageEvent,
} from '@slack/bolt/dist/types/events/message-events';

export class TimelineService {
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
  async apply(event: MessageEvent): Promise<void> {
    if (event.subtype === 'message_deleted') {
      const e = event as MessageDeletedEvent;
      this.deleteMessage({
        channel: e.channel,
        deletedTs: e.deleted_ts,
      });
    } else if (event.subtype === undefined) {
      const e = event as GenericMessageEvent;
      this.postMessage(new Message(e.channel, e.user, e.text, event.ts));
    }
    console.info(`Not handled subtype. ${event.subtype}`);
  }

  private async deleteMessage(m: DeletedMessage): Promise<void> {
    if (m.channel === this.timelineChannelID) {
      return;
    }
    const message = await this.timelineRepository.fetch(m.deletedTs);
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

    const messageId = await this.slackClient.postTimelineMessage(
      this.timelineChannelID,
      message,
      user,
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
