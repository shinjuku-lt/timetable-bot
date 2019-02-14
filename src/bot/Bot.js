/**
 * `BotKit.bot` wrapper
 */
class MentionBot {
    constructor(raw) {
        this.raw = raw
    }

    /**
     * reply message
     * - SeeAlso: https://botkit.ai/docs/core.html#botreply
     */
    reply(message, text) {
        this.raw.reply(message, text)
    }
}

class SlashBot {
    constructor(raw) {
        this.raw = raw
    }

    /**
     * reply message
     * - SeeAlso: https://botkit.ai/docs/readme-slack.html#botreplypublic
     */
    reply(message, text) {
        this.raw.replyPublic(message, text)
    }
}

module.exports = {
    Mention: MentionBot,
    Slash: SlashBot
}
