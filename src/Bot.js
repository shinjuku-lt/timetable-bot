const Botkit = require('botkit');
const Config = require('./Config');

const controller = Botkit.slackbot({
    debug: false,
    json_file_store: Config.FILE_STORAGE_NAME
});

const bot = controller
    .configureSlackApp({
        clientId: Config.SLACK_CLIENT_ID,
        clientSecret: Config.SLACK_CLIENT_SECRET,
        scopes: ['commands']
    });

controller.setupWebserver(Config.PORT, function(err, webServer) {
    if (err) {
        process.exit(1);
        console.error('Error: Cannot to Slack');
    }
});

module.exports = {
    bot: bot,
    controller: controller
};
