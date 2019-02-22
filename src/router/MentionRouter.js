const Args = require('../input/Args')
const Bot = require('../bot/Bot')
const Command = require('../command/Command')
const R = require('../Resource')

/**
 * Slack command `@bot` mention Router
 */
class MentionRouter {
    constructor(controller) {
        this.controller = controller
        this.command = new Command()
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
            this.command.addTalk(bot, message, args)
        })

        /**
         * delete my talk
         *
         * `@bot lt_delete_talk`
         */
        this._request(['lt_delete_talk'], (bot, message, args) => {
            this.command.deleteTalk(bot, message, args)
        })

        /**
         * show(generate) timetable
         *
         * `@bot lt_show_timetable 15:00`
         */
        this._request(['lt_show_timetable'], (bot, message, args) => {
            this.command.showTimetable(bot, message, args)
        })

        /**
         * reschedule timetable
         *
         * `@bot lt_reschedule_timetable 10`
         */
        this._request(['lt_reschedule_timetable'], (bot, message, args) => {
            this.command.rescheduleTimetable(bot, message, args)
        })

        /**
         * clear timetable
         *
         * `@bot lt_clear_timetable`
         */
        this._request(['lt_clear_timetable'], (bot, message, args) => {
            this.command.clearTimetable(bot, message, args)
        })

        /**
         * default
         *
         * - Note: reach when the input command does not exist
         */
        this.controller.hears(['(.*)'], 'direct_mention, direct_mention, mention', (bot, message) => {
            bot.reply(message, R.TEXT.NOT_SUPPORT)
        })
    }

    /**
     * `controller.hears` wrapper
     *
     * @param patterns: An array or a comma separated string containing a list of regular expressions to match
     * @param completion: callback function that receives a (`mentionBot`, `message` `args`)
     *
     * - SeeAlso: https://botkit.ai/docs/core.html#controllerhears
     */
    _request(patterns, completion) {
        this.controller.hears(patterns, 'direct_message, direct_mention, mention', (bot, message) => {
            bot.api.users.info({ user: message.user }, (err, res) => {
                if (err) {
                    bot.reply(message, R.TEXT.UNIVERSAL_ERROR)
                } else {
                    const args = new Args(message, res.user)
                    const mentionBot = new Bot.Mention(bot)
                    completion(mentionBot, message, args)
                }
            })
        })
    }
}

module.exports = MentionRouter
