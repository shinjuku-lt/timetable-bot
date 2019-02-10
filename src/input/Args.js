/**
 * User input command `Response` object
 */
class Args {
    constructor(message, user) {
        this.messageID = message.client_msg_id;
        this.user = user;
        this.texts = (() => {
            let texts = message.text.split(" ");
            return texts;
        })();
    }
}

module.exports = Args;
