const ArrayExtension = require('../extension/ArrayExtension')
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
                const shuffledTalks = ArrayExtension.shuffle(talks)
                const timetable = Timetable.fromInput(shuffledTalks, startDate.value)
                this.timetableRepository.save(this.today, timetable)
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
            this.timetableRepository.delete(this.today)
            bot.reply(message, R.TEXT.CLEAR_SUCCESS)
        } catch (e) {
            console.error(`error: ${e.message}`)
            bot.reply(message, R.TEXT.CLEAR_INVALID)
        }
    }
}

module.exports = Commands
