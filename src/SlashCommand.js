const Args = require('./args/Args');
const ArrayExtension = require('./extensions/ArrayExtension')
const StartDate = require('./args/StartDate')
const Talk = require('./args/Talk')
const TalkRepository = require('./repository/TalkRepository')
const Timetable = require('./Timetable')
const R = require('./Resource')

class SlashCommand {

    constructor(controller) {
        this.controller = controller;
        this.talkRepository = TalkRepository.shared;
    }

    /**
     * Listen conversation
     */
    hearing() {
        
        this.controller.on('slash_command', (bot, message) => {
            bot.replyPublic(message, message.command);
             // TODO Commandsの各コマンドを呼ぶ 
            switch (message.command) {
                case '/lt_show_timetable':
                    break;
                case '/lt_add_talk':
                    break;
                case '/lt_delete_talk':
                    break;
                case '/lt_clear_timetable':
                    break;
                case '/lt_reschedule_timetable':
                    break;
            }
        });
    }
}

module.exports = SlashCommand;
