const ArrayExtension = require('./extensions/ArrayExtension')
const Talk = require('./args/Talk')
const TalkRepository = require('./TalkRepository')
const Timetable = require('./Timetable')
const StartDate = require('./args/StartDate')

/**
 * Slack command EndPoint
 */
class Commands {

    constructor(controller) {
        this.controller = controller;
        this.talkRepository = new TalkRepository();
    }

    /**
     * Listen conversation
     */
    hearing() {

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

            this.talkRepository.fetchAll()
                .then((result) => {
                    const shuffledTalks = ArrayExtension.shuffle(result);
                    const timetable = new Timetable(shuffledTalks, startDate.value);
                    bot.reply(message, timetable.generate());
                });
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
                    this.talkRepository.save(talk.userName, talk);
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
