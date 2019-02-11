const moment = require('moment')

class StartDate {

    constructor(value) {
        this.value = value
    }

    /**
     * factory with args
     *
     * - Note: e.g. args is `15:00`
     * - TODO: add validation logic
     */
    static fromArgs(args) {
        const xs = args.texts[0].split(":")

        if (xs.length !== 2) {
            throw new Error("date parase error")
        }

        const date = moment()
            .hour(xs[0])
            .minutes(xs[1])

        return new StartDate(date)
    }
}

module.exports = StartDate
