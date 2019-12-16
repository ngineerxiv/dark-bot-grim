import { applyCacheBuster } from "../util/Url";
import { BotReactionPattern } from "../Reaction";
import { random } from "../util/Rondom";

const gomas = [
  () => applyCacheBuster("http://yamiga.waka.ru.com/images/goma/01.jpg"),
  () => applyCacheBuster("http://yamiga.waka.ru.com/images/goma/02.jpg"),
  () => applyCacheBuster("http://yamiga.waka.ru.com/images/goma/03.jpg"),
  () => applyCacheBuster("http://yamiga.waka.ru.com/images/goma/04.jpg"),
  () => applyCacheBuster("http://yamiga.waka.ru.com/images/goma/05.jpg"),
  () =>
    "```\n　　　CH \n　　　／＼ \n　　／　＼＼ \nHC／　　　＼＼CH \n ｜｜C6H6　　｜ \n ｜｜　´д｀｜ \nHC＼　　　／／CH \n　　＼　／／ \n　　　＼／ \n　　　CH\n```"
];
const isaos = [
  () =>
    applyCacheBuster(
      "https://36.media.tumblr.com/3df68abdd9a1eb7a0fbda4dacb9930af/tumblr_ns5chdb0Vm1un4u6lo1_1280.jpg",
      "#"
    ),
  () =>
    applyCacheBuster(
      "https://camo.githubusercontent.com/4a011f97909b89a26822ee21e921eb7012e9df18/68747470733a2f2f34302e6d656469612e74756d626c722e636f6d2f31346231333736396364336238303235623163653338626238626238626261352f74756d626c725f6e75313538697269536c31756e3475366c6f315f313238302e6a7067"
    ),
  () =>
    applyCacheBuster(
      "https://68.media.tumblr.com/b167d3c40341868491fc56266994b24a/tumblr_oibhhjbqwM1un4u6lo1_400.gif",
      "#"
    ),
  () =>
    applyCacheBuster(
      "https://68.media.tumblr.com/76e4c36e209a9709f1e66831f8c78d97/tumblr_oo2ynnnv3x1un4u6lo1_400.gif",
      "#"
    )
];

const kirins = [
  () => ":kirin: 「名言 :ha: :tsukureru: 」",
  () =>
    applyCacheBuster(
      "https://78.media.tumblr.com/285789508369fafedf077149d14cbb40/tumblr_ozeltfR7SE1wi2duuo1_1280.png"
    ),
  () =>
    applyCacheBuster(
      "https://78.media.tumblr.com/48b7fb2197972dbf5962c6ce4896e12c/tumblr_ozemn25ogo1r4buwio1_1280.png"
    ),
  () => applyCacheBuster("https://togetter.com/li/1224842")
];

const tries = [
  () => applyCacheBuster("https://cdn.hotolab.net/images/lgtm_mrtry.gif")
];

const papixes = [() => ":papicent: 「強いbotはprettierを捨てる」"];

export const reactions: Array<BotReactionPattern> = [
  [
    /GOMA/i,
    async send => {
      send(random(gomas)());
    },
    b => `${b} goma - やればわかる`
  ],
  [
    /ISAO/i,
    async send => {
      send(random(isaos)());
    },
    b => `${b} goma - やればわかる`
  ],
  [
    /KIRIN/i,
    async send => {
      send(random(kirins)());
    },
    b => `${b} kirin - やればわかる`
  ],
  [
    /KIRIN (\d+)$/i,
    async (send, matched: Array<string>) => {
      const n = matched[1];
      const x = parseFloat(n);
      const y = x / 140000;
      send(`${n}円は${y}きりん`);
    },
    b =>
      `${b} kirin 140000 - 1きりんは・・・ ref: https://togetter.com/li/1224842 `
  ],
  [
    /(MRTRY|TRY)/i,
    async send => send(random(tries)()),
    b => `${b} try|mrtry - やればわかる`
  ],
  [
    /PAPIX/i,
    async send => send(random(papixes)()),
    b => `${b} papix - やればわかる`
  ],
  [
    /^5000兆円欲しい$/,
    async send => send(":atamanowaruihito: :momu:  :momu: :exclamation:")
  ]
];
