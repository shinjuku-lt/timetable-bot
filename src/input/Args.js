const Config = require('../Config')

/**
 * User input command `Response` object
 */
class Args {
    constructor(message, user) {
        this.messageID = message.client_msg_id
        this.user = user
        this.texts = (() => {
            let texts = message.text.split(' ')
            // Important: Fix to texts parsing for `@MentionBot`
            if (!Config.IS_PRODUCTION) {
                texts.shift()
            }
            return texts
        })()
    }
}

module.exports = Args
