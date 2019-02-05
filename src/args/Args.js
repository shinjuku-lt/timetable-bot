/**
 * User input command object
 */
class Args {
    constructor(message, user) {
        this.messageID = message.client_msg_id;
        this.user = user;
        this.texts = (function() {
            let texts = message.text.split(" ");
            texts.shift();
            return texts;
        })();
    }
}

module.exports = Args;
