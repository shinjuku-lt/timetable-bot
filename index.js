const Bot = require('./src/Bot');
const Commands = require('./src/Commands');

if (!process.env.BOT_TOKEN) {
    console.error('Error: Specify `BOT_TOKEN` in environment');
    process.exit(1);
}

const slackCommands = new Commands(Bot.controller);
slackCommands.hearing();
