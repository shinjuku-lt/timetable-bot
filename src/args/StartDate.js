class StartDate {

    constructor(value) {
        this.value = value;
    }

    static fromJson(json) {
        // TODO: error handling
        const args = json.text.split(" ")[1].split(":");
        const date = (function () {
            const d = new Date();
            d.setHours(args[0]);
            d.setMinutes(args[1]);
            return d
        }());

        return new StartDate(date);
    }
}

module.exports = StartDate;
