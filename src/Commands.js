const Args = require('./args/Args');
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
        this.talkRepository = TalkRepository.shared;
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
            try {
                const args = new Args(message, null);
                const startDate = StartDate.fromArgs(args);

                this.talkRepository.fetchAll()
                    .then((result) => {
                        const shuffledTalks = ArrayExtension.shuffle(result);
                        const timetable = new Timetable(shuffledTalks, startDate.value);
                        bot.reply(message, timetable.generate());
                    });
            } catch {
                bot.reply(message, "Invalid format. (*e.g. `show 15:00`*)");
            }
        });

        /**
         * save talk
         *
         * `@bot add title duration`
         */
        this._request(['add'], (bot, message, args) => {
            try {
                const talk = Talk.fromArgs(args);
                this.talkRepository.save(talk.userName, talk);
                bot.reply(message, `_${talk.description}_`);
            } catch {
                bot.reply(message, "Invalid format. (*e.g. `add title 10`*)");
            }
        });

        /**
         * clear all talks
         *
         * `@bot claer`
         */
        this.controller.hears(['clear'], 'direct_mention', (bot, message) => {
            this.talkRepository.deleteAll();
            bot.reply(message, 'Clear all talks🚮');
        });

        /**
         * shutdown bot
         *
         * `@bot shutdown`
         */
        this.controller.hears(['shutdown'], 'direct_mention,', (bot, message) => {
            bot.startConversation(message, (_, convo) => {
                convo.ask('Are you sure you want me to shutdown?', [
                    {
                        pattern: bot.utterances.yes,
                        callback: (_, convo) => {
                            convo.say('Bye!');
                            convo.next();
                            setTimeout(() => {
                                process.exit();
                            }, 3000);
                        }
                    },
                    {
                        pattern: bot.utterances.no,
                        default: true,
                        callback: (_, convo) => {
                            convo.say('*Phew!*');
                            convo.next();
                        }
                    }
                ]);
            });
        });

        /**
         * default
         *
         * - Note: reach when the input command does not exist
         */
        this.controller.hears(['(.*)'], 'direct_mention', (bot, message) => {
            bot.reply(message, 'Command not supported');
        });
    }

    /**
     *
     * `controller.hears` wrapper
     *
     * @param patterns: An array or a comma separated string containing a list of regular expressions to match
     * @param completion: callback function that receives a (`bot`, `message` `args`)
     *
     * - See Also: https://botkit.ai/docs/core.html#controllerhears
     */
    _request(patterns, completion) {
        this.controller.hears(patterns, 'direct_mention', (bot, message) => {
            bot.api.users.info({ user: message.user }, (error, response) => {
                if (error) {
                    bot.reply(message, "Please try again");
                } else {
                    const args = new Args(message, response.user);
                    completion(bot, message, args);
                }
            });
        });
    }
}

module.exports = Commands;
