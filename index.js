const Bot = require('./src/Bot');
const Config = require('./src/Config');
const MentionRouter = require('./src/router/MentionRouter');
const SlashRouter = require('./src/router/SlashRouter');

if (!process.env.BOT_TOKEN) {
    console.error('Error: Specify `BOT_TOKEN` in environment');
    process.exit(1);
}

const command = Config.IS_PRODUCTION
    ? new SlashRouter(Bot)
    : new MentionRouter(Bot.controller);

command.hearing();
