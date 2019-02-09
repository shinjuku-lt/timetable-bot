const Botkit = require('botkit');
const Config = require('./Config');

const controller = Botkit.slackbot({
    debug: false
});

const bot = controller
    .spawn({ token: Config.BOT_TOKEN })
    .startRTM((error, bot, payload) => {
        if (error) {
            process.exit(1);
            console.error('Error: Cannot to Slack');
        }
    });

module.exports = {
    bot: bot,
    controller: controller
};
