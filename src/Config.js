module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    BREAK_THRESHOLD: 60,
    BREAK_TIME_MINUTE: 10,
    FILE_STORAGE_NAME: 'json_db',
    IS_PRODUCTION: (process.env.NODE_ENV === 'production'),
    SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    PORT: process.env.PORT || 3000
}
