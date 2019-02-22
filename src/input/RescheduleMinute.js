class RescheduleMinute {
    constructor(value) {
        this.value = value
    }

    /**
     * factory with args
     *
     * - Note: e.g. args is `30`
     * - TODO: add validation logic
     */
    static fromArgs(args) {
        const minute = parseInt(args.texts[0])

        if (isNaN(minute)) {
            throw new Error('minute parase error')
        }
        if (!(minute >= -100 && minute <= 100)) {
            throw new Error('duration parase error')
        }

        return new StartDate(minute)
    }
}

module.exports = RescheduleMinute
