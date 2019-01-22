const config = require('./Config')

class Timetable {

    constructor(talks, date) {
        this.talks = talks;
        this.date = date;
    }

    // TODO: refactor it simple
    generate() {
        const introduction = `${this.zeroPadding(this.date.getHours())}:${this.zeroPadding(this.date.getMinutes())} 開始`;
        const result = this.talks.reduce((prev, current, index, array) => {
            const d = new Date(this.date.getTime());
            d.setMinutes(d.getMinutes() + prev.elapsed);
            prev.message += `\n${this.zeroPadding(d.getHours())}:${this.zeroPadding(d.getMinutes())} @${current.userName} 「${current.title}」`;
            prev.elapsed += current.duration;
            if (prev.elapsed >= prev.interval * (prev.breakCount + 1) + prev.breakCount * config.BREAK_TIME_MINUTE) {
                const d2 = new Date(this.date.getTime());
                d2.setMinutes(d2.getMinutes() + prev.elapsed);
                prev.message += `\n${this.zeroPadding(d2.getHours())}:${this.zeroPadding(d2.getMinutes())} ${config.BREAK_TIME_MINUTE} 分休憩`;
                prev.elapsed += config.BREAK_TIME_MINUTE;
                prev.breakCount++;
            }
            return prev;
        }, { message: "", interval: 60, breakCount: 0, elapsed: 0 });
        const d = new Date(this.date.getTime());
        d.setMinutes(d.getMinutes() + result.elapsed);
        const closing = `\n${this.zeroPadding(d.getHours())}:${this.zeroPadding(d.getMinutes())} 終了`;
        return introduction + result.message + closing;
    }

    zeroPadding(n) {
        return ('00' + n).slice(-2);
    }
}

module.exports = Timetable;
