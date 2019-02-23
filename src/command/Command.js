const ArrayExtension = require('../extension/ArrayExtension')
const moment = require('moment')
const RescheduleMinute = require('../input/RescheduleMinute')
const StartDate = require('../input/StartDate')
const Talk = require('../input/Talk')
const TalkRepository = require('../repository/TalkRepository')
const Timetable = require('../output/Timetable')
const TimetableRepository = require('../repository/TimetableRepository')
const R = require('../Resource')

/**
 * Slack command EndPoint Action
 *
 * - Note: for MVC, corresponds to `Controller`
 * - Important: **optimize** `/` command setting
 *   - https://github.com/shinjuku-lt/timetable-bot/pull/35
 */
class Commands {
    constructor() {
        this.talkRepository = TalkRepository.shared
        this.timetableRepository = TimetableRepository.shared
        this.today = moment().format('YYYY-MM-DD')
    }

    addTalk(bot, message, args) {
        try {
            const talk = Talk.fromArgs(args)
            this.talkRepository.save(args.user.id, talk)
            bot.reply(message, {
                attachments: [
                    {
                        text: `_${talk.description}_`,
                        color: 'good',
                    },
                ],
            })
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, {
                attachments: [
                    {
                        text: R.TEXT.ADD_INVALID,
                        color: 'danger',
                    },
                ],
            })
        }
    }

    deleteTalk(bot, message, args) {
        try {
            this.talkRepository.delete(args.user.id)
            bot.reply(message, {
                attachments: [
                    {
                        text: R.TEXT.DELETE_SUCCESS,
                        color: 'good',
                    },
                ],
            })
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, {
                attachments: [
                    {
                        text: R.TEXT.UNIVERSAL_ERROR,
                        color: 'danger',
                    },
                ],
            })
        }
    }

    showTimetable(bot, message, args) {
        try {
            const startDate = StartDate.fromArgs(args)
            const talks = this.talkRepository.fetchAll()

            if (talks.length === 0) {
                bot.reply(message, {
                    attachments: [
                        {
                            text: R.TEXT.SHOW_EMPTY,
                            color: 'warning',
                        },
                    ],
                })
            } else {
                const shuffledTalks = ArrayExtension.shuffle(talks)
                const timetable = Timetable.fromInput(shuffledTalks, startDate.value)
                this.timetableRepository.save(this.today, timetable)
                bot.reply(message, {
                    attachments: [
                        {
                            text: timetable.description,
                            color: 'good',
                        },
                    ],
                })
            }
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, {
                attachments: [
                    {
                        text: R.TEXT.SHOW_INVALID,
                        color: 'danger',
                    },
                ],
            })
        }
    }

    rescheduleTimetable(bot, message, args) {
        try {
            const rescheduleMinute = RescheduleMinute.fromArgs(args).value
            const timetable = this.timetableRepository.fetch(this.today)

            if (!timetable) {
                bot.reply(message, {
                    attachments: [
                        {
                            text: R.TEXT.SHOW_EMPTY,
                            color: 'warning',
                        },
                    ],
                })
            } else {
                const rescheduledTimetable = timetable.reschedule(rescheduleMinute)
                this.timetableRepository.save(this.today, rescheduledTimetable)

                bot.reply(message, {
                    attachments: [
                        {
                            text: `*${R.TEXT.RESCHEDULE_SUCCESS}*\n ${rescheduledTimetable.description}`,
                            color: 'good',
                        },
                    ],
                })
            }
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, {
                attachments: [
                    {
                        text: R.TEXT.RESCHEDULE_INVALID,
                        color: 'danger',
                    },
                ],
            })
        }
    }

    clearTimetable(bot, message, args) {
        try {
            this.talkRepository.deleteAll()
            this.timetableRepository.delete(this.today)
            bot.reply(message, {
                attachments: [
                    {
                        text: R.TEXT.CLEAR_SUCCESS,
                        color: 'good',
                    },
                ],
            })
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, {
                attachments: [
                    {
                        text: R.TEXT.CLEAR_INVALID,
                        color: 'danger',
                    },
                ],
            })
        }
    }
}

module.exports = Commands
