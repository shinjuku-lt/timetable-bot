const Raw = require('./Raw')

class Timetable {
    constructor(raws, startDate) {
        this.raws = raws
        this.startDate = startDate
    }

    /**
     * `Input` user command model -> `Output` view model
     *
     * @param {input.Talk} talks
     * @param {moment} startDate
     */
    static fromInput(talks, startDate) {
        const startRaw = Raw.makeStart(startDate.clone())
        const raws = talks.reduce(
            (acc, talk) => {
                acc.raws.push(Raw.fromInput(talk, acc.date.clone()))
                acc.date = acc.date.add(talk.duration, 'm')
                return acc
            },
            { raws: [], date: startDate }
        ).raws
        const endRaw = Raw.makeEnd(startDate)

        return new Timetable(
            (() => {
                raws.unshift(startRaw)
                raws.push(endRaw)
                return raws
            })(),
            startDate
        )
    }

    get description() {
        return this.raws.reduce((acc, raw, index) => {
            const d = raw.description
            return (acc += index === 0 ? d : `\n${d}`)
        }, '')
    }
}

module.exports = Timetable
