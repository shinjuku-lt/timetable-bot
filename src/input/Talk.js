class Talk {

    constructor(user, title, duration) {
        this.user = user;
        this.title = title;
        this.duration = duration;
    }

    get description() {
        return `name: ${this.user.name}, title: ${this.title}, duration: ${this.duration}m`
    }

    static fromArgs(args) {
        const title = args.texts[0];
        const duration = parseInt(args.texts[1]);

        if (isNaN(duration)) {
            throw new Error("duration parase error");
        }

        return new Talk(
            args.user,
            title,
            duration
        );
    }
}

module.exports = Talk;
