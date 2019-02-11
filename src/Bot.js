const Botkit = require('botkit');
const Config = require('./Config');

const controller = Botkit.slackbot({
    debug: false,
    json_file_store: Config.FILE_STORAGE_NAME
});

const bot = controller.spawn({
    token: process.env.BOT_TOKEN
}).startRTM()

controller.setupWebserver(Config.PORT, (err, webserver) => {
    if (Config.IS_PRODUCTION) {
        controller.createWebhookEndpoints(controller.webserver);
        controller.createOauthEndpoints(controller.webserver, (err, req, res) => {
            if (err) {
                res.status(500).send('Error: ' + JSON.stringify(err));
            } else {
                res.send('Success');
            }
        });
    }
});

// `SlashRouter` setting
if (Config.IS_PRODUCTION) {
    controller.configureSlackApp({
        clientId: Config.SLACK_CLIENT_ID,
        clientSecret: Config.SLACK_CLIENT_SECRET,
        scopes: ['commands']
    });

    // store `teamId` to BotKit.builtin file storage
    bot.api.team.info({}, (err, res) => {
        if (err) throw new Error(err.stack || JSON.stringify(err));
        // workaround: https://github.com/howdyai/botkit/issues/590
        res.team.bot = {
            id: 'boti',
            name: 'boti'
        };

        controller.saveTeam(res.team, () => {})
    });
}

module.exports = {
    controller: controller,
    bot: bot
};
