import {
  App as SlackApp,
  directMention,
  SlackEventMiddlewareArgs,
} from '@slack/bolt';

type SlackReaction = [
  RegExp,
  (arg: SlackEventMiddlewareArgs<'message'>) => Promise<void>,
];

const reactions: Array<SlackReaction> = [
  [
    /^channel$|^チャンネル$/,
    async (arg: SlackEventMiddlewareArgs<'message'>): Promise<void> => {
      arg.say(`ここのチャンネルIDは ${arg.event.channel}`);
    },
  ],
];

export function apply(app: SlackApp): void {
  reactions.forEach(r => {
    const [reg, res] = r;
    app.message(reg, ...[directMention(), res]);
  });
}
