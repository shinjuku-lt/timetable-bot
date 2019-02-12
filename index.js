const App = require('./src/App')
const Config = require('./src/Config')
const MentionRouter = require('./src/router/MentionRouter')
const SlashRouter = require('./src/router/SlashRouter')

if (!process.env.BOT_TOKEN) {
    console.error('Error: Specify `BOT_TOKEN` in environment')
    process.exit(1)
}

const router = Config.IS_PRODUCTION
    ? new SlashRouter(App.controller, App.bot)
    : new MentionRouter(App.controller)

router.hearing()
