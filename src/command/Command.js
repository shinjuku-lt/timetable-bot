const ArrayExtension = require('../extension/ArrayExtension')
const Break = require('../input/Break')
const Config = require('../Config')
const StartDate = require('../input/StartDate')
const Talk = require('../input/Talk')
const TalkRepository = require('../repository/TalkRepository')
const Timetable = require('../output/Timetable')
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
    }

    addTalk(bot, message, args) {
        try {
            const talk = Talk.fromArgs(args)
            this.talkRepository.save(args.user.id, talk)
            bot.reply(message, `_${talk.description}_`)
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, R.TEXT.ADD_INVALID)
        }
    }

    deleteTalk(bot, message, args) {
        try {
            this.talkRepository.delete(args.user.id)
            bot.reply(message, R.TEXT.DELETE_SUCCESS)
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, R.TEXT.UNIVERSAL_ERROR)
        }
    }

    showTimetable(bot, message, args) {
        try {
            const startDate = StartDate.fromArgs(args)
            const talks = this.talkRepository.fetchAll()

            if (talks.length === 0) {
                bot.reply(message, R.TEXT.SHOW_EMPTY)
            } else {
                const _talks = ArrayExtension.shuffle(talks)

                // TDDO: consider adding `usercase` class
                const breakIndexes = _talks.reduce((acc, talk, index) => {
                    acc.elapsed += talk.duration
                    if (acc.elapsed >= Config.BREAK_THRESHOLD && ((talks.length - 1) !== index)) {
                        acc.indexes.push(index + (acc.breakCount + 1))
                        acc.elapsed = 0
                        acc.breakCount += 1
                    }
                    return acc
                }, { indexes: [], elapsed: 0, breakCount: 0 }).indexes

                breakIndexes.forEach(index => {
                    _talks.splice(index, 0, new Break(Config.BREAK_TIME_MINUTE))
                })

                // TDDO: consider adding `usercase` class
                this.talkRepository.deleteAll()
                _talks.forEach(talk => {
                    this.talkRepository.save(talk.user.id, talk)
                })

                const timetable = new Timetable(_talks, startDate.value)
                bot.reply(message, timetable.description)
            }

        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, R.TEXT.SHOW_INVALID)
        }
    }

    rescheduleTimetable(bot, message, args) {
        try {
            const startDate = StartDate.fromArgs(args)
            const talks = this.talkRepository.fetchAll()

            if (talks.length === 0) {
                bot.reply(message, R.TEXT.SHOW_EMPTY)
            } else {
                const timetable = new Timetable(talks, startDate.value)
                bot.reply(message, `*${R.TEXT.RESCHEDULE_SUCCESS}*\n ${timetable.description}`)
            }

        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, R.TEXT.RESCHEDULE_INVALID)
        }
    }

    clearTimetable(bot, message, args) {
        try {
            this.talkRepository.deleteAll()
            bot.reply(message, R.TEXT.CLEAR_SUCCESS)
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, R.TEXT.CLEAR_INVALID)
        }
    }
}

module.exports = Commands
