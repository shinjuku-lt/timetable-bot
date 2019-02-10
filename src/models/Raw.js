/**
 * Timetable raw *ViewModel*
 */
class Raw {

    constructor(author, title, startDate) {
        this.author = author;
        this.title = title;
        this.startDate = startDate;
    }

    get description() {
        return `${this.startDate.format('MM:DD')} ${this.author} "${this.title}"`
    }

    static fromArgs(args, startDate) {
        return new Raw(
            args.userName,
            args.title,
            startDate
        );
    }

    static makeStart(date) {
        return new Raw(null, 'start', date);
    }

    static makeEnd(date) {
        return new Raw(null, 'end', date);
    }
}

module.exports = Raw;
