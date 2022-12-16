import { Message, MessageID } from './Domain';

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
