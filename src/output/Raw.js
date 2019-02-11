/**
 * Timetable raw *ViewModel*
 */
class Raw {

    constructor(author, title, startDate) {
        this.author = author
        this.title = title
        this.startDate = startDate
    }

    get description() {
        let text = this.startDate.format('HH:mm')
        if (this.author) {
            text += ` @${this.author}`
        }
        if (this.title) {
            text += ` _${this.title}_`
        }
        return text
    }

    static fromInput(input, startDate) {
        return new Raw(
            input.user.name,
            input.title,
            startDate
        )
    }

    static makeStart(date) {
        return new Raw(null, 'start', date)
    }

    static makeEnd(date) {
        return new Raw(null, 'end', date)
    }
}

module.exports = Raw
