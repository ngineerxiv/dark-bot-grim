import { Message, MessageID } from './Domain';
import { RedisClient } from 'redis';
import { promisify } from 'util';

export interface TimelineRepository {
  put(m: Required<Message>): void;

  fetch(id: MessageID): Promise<Required<Message> | null>;

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
  async fetch(id: MessageID): Promise<Required<Message> | null> {
    const m = this.data.get(id);
    return m === undefined ? null : m;
  }
  delete(id: MessageID): void {
    this.data.delete(id);
  }
}

export class TimelineRepositoryOnRedis implements TimelineRepository {
  readonly redis: RedisClient;
  constructor(redis: RedisClient) {
    this.redis = redis;
  }

  put(m: Required<Message>): void {
    this.redis.set(m.ts, JSON.stringify(m));
    return;
  }
  async fetch(id: string): Promise<Required<Message>> {
    const get = promisify(this.redis.get).bind(this.redis);
    const m = await get(id);
    if (m === null) {
      return null;
    }
    const message: {
      channel: string;
      user: string;
      text: string;
      ts: string;
      timelineMessageTs: string;
    } = JSON.parse(m);
    return new Message(
      message.channel,
      message.user,
      message.text,
      message.ts,
    ).withId(message.timelineMessageTs);
  }
  delete(id: string): void {
    this.redis.del(id);
  }
}
