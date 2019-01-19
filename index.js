const ArrayExtension = require('./extensions/ArrayExtension')
const Botkit = require("botkit");
const Config = require('./config/Config')
const Talk = require('./models/Talk')
const Timetable = require('./models/Timetable')

const controller = Botkit.slackbot({
    debug: false,
});

const map = new Map();

controller.spawn({
    token: Config.botToken
}).startRTM((err, bot, payload) => {
    if (err) {
        throw new Error(err);
    }
});

/**
 * show usage
 *
 * `@bot help`
 */
controller.hears(["help"], ["direct_mention"], (bot, message) => {
    bot.reply(message, 'TODO');
});

/**
 * show timetable
 *
 * `@bot show 15:00`
 */
controller.hears(["show"], ["direct_mention"], (bot, message) => {
    const time = message.text.split(" ")[1].split(":");
    const now = new Date();
    now.setHours(time[0]);
    now.setMinutes(time[1]);
    const talks = ArrayExtension.shuffle(Array.from(map.values()));
    bot.reply(message, new Timetable(talks, now).generate());
});

/**
 * save talk
 *
 * `@bot add title,duration`
 */
controller.hears(["add"], ["direct_mention"], (bot, message) => {
    bot.api.users.info({ user: message.user }, (err, response) => {
        if (err) {
            bot.say("ERROR :(");
        } else {
            const talk = Talk.make(message, response)
            map.set(talk.userName, talk);
            bot.reply(message, 'saved talk⚡️');
        }
    });
});
