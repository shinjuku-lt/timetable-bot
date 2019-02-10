const Bot = require('./src/Bot');
const Commands = require('./src/Commands');
const SlashCommand = require('./src/SlashCommand');

if (!process.env.BOT_TOKEN) {
    console.error('Error: Specify `BOT_TOKEN` in environment');
    process.exit(1);
}

const isProd = true;
const command =  isProd ? new SlashCommand(Bot.controller) : new Commands(Bot.controller);
command.hearing();
