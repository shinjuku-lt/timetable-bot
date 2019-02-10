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
        let bot = this.controller.spawn({
            token: process.env.BOT_TOKEN
        }).startRTM()

        // teamIdをストレージに保存する
        bot.api.team.info({}, (err, response) => {
            if (err) throw new Error(err.stack || JSON.stringify(err));
            // FIX2 this is a workaround for https://github.com/howdyai/botkit/issues/590
            response.team.bot = {
                id: 'boti',
                name: 'boti'
            };
            // END FIX2
            this.controller.saveTeam(response.team, () => {
                // ignore
            })
        });

        this.controller.on('slash_command', (bot, message) => {
            bot.replyPublic(message, message.command);
             // TODO Commandsの各コマンドを呼ぶ 
            switch (message.command) {
                case '/lt_show':
                    break;
                case '/lt_add':
                    break;
                case '/lt_delete':
                    break;
                case '/lt_clear':
                    break;
            }
        });
    }
}

module.exports = SlashCommand;
