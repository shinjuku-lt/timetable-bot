const Args = require('../input/Args');
const Command = require('../command/Command')
const R = require('../Resource')

/**
 * Slack command `/` slash Router
 */
class SlashCommand {

    constructor(bot) {
        this.controller = bot.controller;
        this.bot = bot.bot
        this.command = new Command()
    }

    /**
     * Listen conversation
     */
    hearing() {
        this.controller.on('slash_command', (bot, message) => {
            this.bot.api.users.info({ user: message.user }, (error, response) => {
                if (error) {
                    bot.reply(message, R.TEXT.UNIVERSAL_ERROR);
                } else {
                    const args = new Args(message, response.user);
                    switch (message.command) {
                        case '/lt_add_talk':
                            this.command.addTalk(bot, message, args)
                            break;
                        case '/lt_delete_talk':
                            this.command.deleteTalk(bot, message, args)
                            break;
                        case '/lt_show_timetable':
                            this.command.showTimetable(bot, message, args)
                            break;
                        case '/lt_reschedule_timetable':
                            this.command.rescheduleTimetable(bot, message, args)
                            break;
                        case '/lt_clear_timetable':
                            this.command.clearTimetable(bot, message, args)
                            break;
                    }
                }
            })
        });
    }
}

module.exports = SlashCommand;
