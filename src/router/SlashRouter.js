const Args = require('../input/Args')
const Bot = require('../bot/Bot')
const Command = require('../command/Command')
const R = require('../Resource')

/**
 * Slack command `/` slash Router
 */
class SlashCommand {

    constructor(controller, bot) {
        this.controller = controller
        this.bot = bot
        this.command = new Command()
    }

    /**
     * Listen conversation
     */
    hearing() {
        this.controller.on('slash_command', (bot, message) => {
            // Important: use `this.bot.api.users` !
            this.bot.api.users.info({ user: message.user }, (err, res) => {
                if (err) {
                    bot.replyPublic(message, R.TEXT.UNIVERSAL_ERROR)
                } else {
                    const args = new Args(message, res.user)
                    const slashBot = new Bot.Slash(bot)
                    switch (message.command) {
                        case '/lt_add_talk':
                            this.command.addTalk(slashBot, message, args)
                            break
                        case '/lt_delete_talk':
                            this.command.deleteTalk(slashBot, message, args)
                            break
                        case '/lt_show_timetable':
                            this.command.showTimetable(slashBot, message, args)
                            break
                        case '/lt_reschedule_timetable':
                            this.command.rescheduleTimetable(slashBot, message, args)
                            break
                        case '/lt_clear_timetable':
                            this.command.clearTimetable(slashBot, message, args)
                            break
                    }
                }
            })
        })
    }
}

module.exports = SlashCommand
