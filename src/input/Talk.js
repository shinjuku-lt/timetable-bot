class Talk {
    constructor(user, title, duration) {
        this.user = user
        this.title = title
        this.duration = duration
    }

    get description() {
        return `name: ${this.user.name}, title: ${this.title}, duration: ${this.duration}m`
    }

    /**
     * factory with args
     *
     * - Note: e.g. args is `text 10`
     * - TODO: add validation logic
     */
    static fromArgs(args) {
        const title = args.texts[0]
        const duration = parseInt(args.texts[1])

        if (isNaN(duration)) {
            throw new Error('duration parase error')
        }
        if (!(duration >= 5 && duration <= 60)) {
            throw new Error('duration parase error')
        }

        return new Talk(args.user, title, duration)
    }
}

module.exports = Talk
