module.exports = class Talk {
    constructor(userName, title, duration) {
        this.userName = userName;
        this.title = title;
        this.duration = duration;
    }

    static make(message, response) {
        const ary = message.text.split(" ")[1].split(",");
        const userName = response["user"]['name'];
        const title = ary[0];
        const duration = parseInt(ary[1], 10);
        return new Talk(userName, title, duration);
    }
}