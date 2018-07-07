const Botkit = require("botkit");
const Talk = require('./models/Talk')
const Timetable = require('./models/Timetable')
const Config = require('./config/Config')
const ArrayUtil = require('./util/ArrayUtil')

// bot controller 取得
const controller = Botkit.slackbot({
    debug: false,
});

// Talkを保持するMap
const map = new Map();

/*
map.set("honmarkhunt", new Talk("honmarkhunt", "kubernetesはクソ", 5));
map.set("to4iki", new Talk("to4iki", "おれが語るDDD", 20));
map.set("disc99", new Talk("disc99", "そのドメインは本当にドメインと言う名のドメイン型ドメインDDD？", 65));
map.set("kyusuke", new Talk("kyusuke", "ルンバ買った", 10));
map.set("yshn", new Talk("yshn", "LTで宗教画を使ったらバチカンに告訴された件", 50));
*/

// botの起動
controller.spawn({
    token: Config.botToken
}).startRTM((err, bot, payload) => {
    // エラーが出たら落とす
    if (err) {
        throw new Error(err);
    }
});

// 指定した単語が、指定の方法で投稿された場合に、コールバックを実行する
controller.hears(["hello"], ["direct_mention"], (bot, message) => {
    bot.reply(message, "World");
});

/*
 LTの開始
*/
controller.hears(["ltstart"], ["direct_mention"], (bot, message) => {
    console.log(map);
    const time = message.text.split(" ")[1].split(":");
    const now = new Date();
    now.setHours(time[0]);
    now.setMinutes(time[1]);
    const talks = ArrayUtil.shuffle(Array.from(map.values()));
    bot.reply(message, new Timetable(talks, now).generate());
});

/*
 トークの追加
*/
controller.hears(["lt"], ["direct_mention"], (bot, message) => {
    bot.api.users.info({ user: message.user }, (err, response) => {
        if (err) {
            bot.say("ERROR :(");
        } else {
            const user = message.user;
            const talk = Talk.make(message, response)
            map.set(talk.userName, talk);
        }
    });
});
