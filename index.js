const Bot = require('./src/Bot');
const SlashCommand = require('./src/SlashCommand');

if (!process.env.BOT_TOKEN) {
    console.error('Error: Specify `BOT_TOKEN` in environment');
    process.exit(1);
}

const slashCommand = new SlashCommand(Bot.controller);
slashCommand.hearing();
