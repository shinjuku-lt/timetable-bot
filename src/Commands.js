const Args = require('./input/Args');
const ArrayExtension = require('./extension/ArrayExtension')
const Break = require('./input/Break')
const Config = require('./Config');
const StartDate = require('./input/StartDate')
const Talk = require('./input/Talk')
const TalkRepository = require('./repository/TalkRepository')
const Timetable = require('./output/Timetable')
const R = require('./Resource')

/**
 * Slack command EndPoint
 *
 * - Note: for MVC, corresponds to `Controller`
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
         * add your talk
         *
         * `@bot lt_add_talk title duration`
         */
        this._request(['lt_add_talk'], (bot, message, args) => {
            try {
                const talk = Talk.fromArgs(args);
                this.talkRepository.save(args.user.id, talk);
                bot.reply(message, `_${talk.description}_`);
            } catch (e) {
                console.error(`error: ${e.message}`);
                bot.reply(message, R.TEXT.ADD_INVALID);
            }
        });

        /**
         * delete my talk
         *
         * `@bot lt_delete_talk`
         */
        this._request(['lt_delete_talk'], (bot, message, args) => {
            try {
                this.talkRepository.delete(args.user.id);
                bot.reply(message, R.TEXT.DELETE_SUCCESS);
            } catch (e) {
                console.error(`error: ${e.message}`);
                bot.reply(message, R.TEXT.UNIVERSAL_ERROR);
            }
        });

        /**
         * show timetable
         *
         * `@bot lt_show_timetable 15:00`
         */
        this._request(['lt_show_timetable'], (bot, message, args) => {
            bot.startConversation(message, (_, convo) => {
                convo.ask(R.TEXT.RESCHEDULE_ASK, [
                    {
                        pattern: bot.utterances.yes,
                        callback: (_, convo) => {
                            (async () => {
                                try {
                                    const startDate = StartDate.fromArgs(args);
                                    const talks = await this.talkRepository.fetchAll();

                                    if (talks.length === 0) {
                                        convo.say(R.TEXT.SHOW_EMPTY);
                                    } else {
                                        const _talks = ArrayExtension.shuffle(talks);

                                        // TDDO: refactor
                                        const breakIndexes = _talks.reduce((acc, talk, index) => {
                                            acc.elapsed += talk.duration
                                            if (acc.elapsed >= Config.BREAK_THRESHOLD && ((talks.length - 1) !== index)) {
                                                acc.indexes.push(index + (acc.breakCount + 1));
                                                acc.elapsed = 0
                                                acc.breakCount += 1
                                            }
                                            return acc
                                        }, { indexes: [], elapsed: 0, breakCount: 0 }).indexes;

                                        breakIndexes.forEach(index => {
                                            _talks.splice(index, 0, new Break(Config.BREAK_TIME_MINUTE));
                                        });

                                        // replace
                                        // TODO: refactor
                                        this.talkRepository.deleteAll()
                                        _talks.forEach(talk => {
                                            this.talkRepository.save(talk.user.id, talk)
                                        })

                                        const timetable = new Timetable(_talks, startDate.value);
                                        convo.say(timetable.description);
                                    }

                                } catch (e) {
                                    console.error(`error: ${e.message}`);
                                    convo.say(R.TEXT.SHOW_INVALID);
                                } finally {
                                    convo.next();
                                }
                            })();
                        }
                    },
                    {
                        pattern: bot.utterances.no,
                        default: true,
                        callback: (_, convo) => {
                            convo.say(R.TEXT.UNIVERSAL_ASK_NO);
                            convo.next();
                        }
                    }
                ]);
            });
        });

        /**
         * reschedule timetable
         *
         * `@bot lt_reschedule_timetable 17:00`
         */
        this._request(['lt_reschedule_timetable'], (bot, message, args) => {
            bot.startConversation(message, (_, convo) => {
                convo.ask(R.TEXT.RESCHEDULE_ASK, [
                    {
                        pattern: bot.utterances.yes,
                        callback: (_, convo) => {
                            (async () => {
                                try {
                                    const startDate = StartDate.fromArgs(args);
                                    const talks = await this.talkRepository.fetchAll();

                                    if (talks.length === 0) {
                                        convo.say(R.TEXT.SHOW_EMPTY);
                                    } else {
                                        const timetable = new Timetable(talks, startDate.value);
                                        convo.say(`*${R.TEXT.RESCHEDULE_SUCCESS}*\n ${timetable.description}`);
                                    }

                                } catch (e) {
                                    console.error(`error: ${e.message}`);
                                    convo.say(R.TEXT.RESCHEDULE_INVALID);
                                } finally {
                                    convo.next();
                                }
                            })();
                        }
                    },
                    {
                        pattern: bot.utterances.no,
                        default: true,
                        callback: (_, convo) => {
                            convo.say(R.TEXT.UNIVERSAL_ASK_NO);
                            convo.next();
                        }
                    }
                ]);
            });
        });

        /**
         * clear timetable
         *
         * `@bot lt_clear_timetable`
         */
        this._request(['lt_clear_timetable'], (bot, message, _) => {
            bot.startConversation(message, (_, convo) => {
                convo.ask(R.TEXT.CLEAR_ASK, [
                    {
                        pattern: bot.utterances.yes,
                        callback: (_, convo) => {
                            try {
                                this.talkRepository.deleteAll();
                                convo.say(R.TEXT.CLEAR_SUCCESS);
                            } catch (e) {
                                console.error(`error: ${e.message}`);
                                convo.say(R.TEXT.CLEAR_INVALID);
                            } finally {
                                convo.next();
                            }
                        }
                    },
                    {
                        pattern: bot.utterances.no,
                        default: true,
                        callback: (_, convo) => {
                            convo.say(R.TEXT.UNIVERSAL_ASK_NO);
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
        this.controller.hears(['(.*)'], 'direct_mention, direct_mention, mention', (bot, message) => {
            bot.reply(message, R.TEXT.NOT_SUPPORT);
        });
    }

    /**
     * `controller.hears` wrapper
     *
     * @param patterns: An array or a comma separated string containing a list of regular expressions to match
     * @param completion: callback function that receives a (`bot`, `message` `args`)
     *
     * - SeeAlso: https://botkit.ai/docs/core.html#controllerhears
     */
    _request(patterns, completion) {
        this.controller.hears(patterns, 'direct_message, direct_mention, mention', (bot, message) => {
            bot.api.users.info({ user: message.user }, (error, response) => {
                if (error) {
                    bot.reply(message, R.TEXT.UNIVERSAL_ERROR);
                } else {
                    const args = new Args(message, response.user);
                    completion(bot, message, args);
                }
            });
        });
    }
}

module.exports = Commands;
