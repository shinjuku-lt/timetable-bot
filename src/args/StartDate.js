class StartDate {

    constructor(value) {
        this.value = value;
    }

    static fromArgs(args) {
        // e.g. [15,00]
        const xs = args.texts[0].split(":")

        if (xs.length !== 2) {
            throw new Error("date parase error");
        }

        const date = (() => {
            const d = new Date();
            d.setHours(xs[0]);
            d.setMinutes(xs[1]);
            return d
        })();

        return new StartDate(date);
    }
}

module.exports = StartDate;
