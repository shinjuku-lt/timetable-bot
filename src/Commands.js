const ArrayExtension = require('./extensions/ArrayExtension')
const Talk = require('./args/Talk')
const Timetable = require('./Timetable')
const StartDate = require('./args/StartDate')

/**
 * Slack command EndPoint
 */
class Commands {

    constructor(controller) {
        this.controller = controller;
    }

    /**
     * Listen conversation
     */
    hearing() {

        // Dummy In-Memory store
        // - TODO: impl file storage
        const map = new Map();

        /**
         * show usage
         *
         * `@bot help`
         */
        this.controller.hears(['help'], 'direct_mention', (bot, message) => {
            bot.reply(message, 'TODO');
        });

        /**
         * show timetable
         *
         * `@bot show 15:00`
         */
        this.controller.hears(['show'], 'direct_mention', (bot, message) => {
            const requestJson = Commands.requestJson(message, null);
            const startDate = StartDate.fromJson(requestJson);
            const talks = ArrayExtension.shuffle(Array.from(map.values()));
            const timetable = new Timetable(talks, startDate.value);
            bot.reply(message, timetable.generate());
        });

        /**
         * save talk
         *
         * `@bot add title,duration`
         */
        this.controller.hears(['add'], 'direct_mention', (bot, message) => {
            bot.api.users.info({ user: message.user }, (err, response) => {
                if (err) {
                    bot.say("ERROR :(");
                } else {
                    const requestJson = Commands.requestJson(message, response.user);
                    const talk = Talk.fromJson(requestJson)
                    map.set(talk.userName, talk);
                    bot.reply(message, 'saved talk⚡️');
                }
            });
        });
    }

    /**
     * (private) build request json-object
     */
    static requestJson(message, requestUser) {
        return {
            text: message.text,
            requestUser: requestUser
        }
    }
}

module.exports = Commands;
