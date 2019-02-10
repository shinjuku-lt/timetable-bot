const ArrayExtension = require('../extension/ArrayExtension')
const Break = require('../input/Break')
const Config = require('../Config');
const StartDate = require('../input/StartDate')
const Talk = require('../input/Talk')
const TalkRepository = require('../repository/TalkRepository')
const Timetable = require('../output/Timetable')
const R = require('../Resource')

/**
 * Slack command EndPoint Action
 *
 * - Note: for MVC, corresponds to `Controller`
 */
class Commands {

    constructor() {
        this.talkRepository = TalkRepository.shared
    }

    addTalk(bot, message, args) {
        try {
            const talk = Talk.fromArgs(args);
            this.talkRepository.save(args.user.id, talk);
            bot.replyPublic(message, `_${talk.description}_`);
        } catch (e) {
            console.error(`error: ${e.message}`);
            bot.replyPublic(message, R.TEXT.ADD_INVALID);
        }
    }

    deleteTalk(bot, message, args) {
        try {
            this.talkRepository.delete(args.user.id);
            bot.replyPublic(message, R.TEXT.DELETE_SUCCESS);
        } catch (e) {
            console.error(`error: ${e.message}`);
            bot.replyPublic(message, R.TEXT.UNIVERSAL_ERROR);
        }
    }

    showTimetable(bot, message, args) {
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
    }

    rescheduleTimetable(bot, message, args) {
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
    }

    clearTimetable(bot, message, args) {
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
    }
}

module.exports = Commands;
