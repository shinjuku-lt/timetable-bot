const config = require('../config/Config')

module.exports = class Timetable {
    constructor(talks, date) {
        this.talks = talks;
        this.date = date;
    }

    generate() {
        var message = this.zeroPadding(this.date.getHours()) + ":" + this.zeroPadding(this.date.getMinutes()) + " 開始";
        this.talks.reduce((prev, current, index, array) => {
            const hour = this.date.getHours();
            prev += "\n" + this.zeroPadding(this.date.getHours()) + ":" + this.zeroPadding(this.date.getMinutes()) +
                " @" + current.userName + " 「" + current.title + "」";
            this.date.setMinutes(this.date.getMinutes() + current.duration);
            const d = new Date(this.date.getTime());
            d.setMinutes(d.getMinutes() + current.duration);
            if (hour != d.getHours() && index != array.length - 1) {
                prev += "\n" + this.zeroPadding(this.date.getHours()) + ":" + this.zeroPadding(this.date.getMinutes()) +
                    " " + config.breakTiemMinute + "分休憩";
                this.date.setMinutes(this.date.getMinutes() + config.breakTiemMinute);
            }
            return prev;
        }, message);
        message += '\n' + this.zeroPadding(this.date.getHours()) + ":" + this.zeroPadding(this.date.getMinutes()) + "終了";
        return message;
    }

    zeroPadding(n) {
        return ('00' + n).slice(-2);
    }
}