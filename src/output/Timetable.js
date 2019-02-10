const Raw = require('./Raw');

class Timetable {

    /**
     *
     * @param {args.Talk} talks
     * @param {moment} startDate
     */
    constructor(talks, startDate) {
        const startRaw = Raw.makeStart(startDate.clone())
        const raws = talks.reduce((acc, talk) => {
            acc.date = acc.date.add(talk.duration, 'm')
            acc.raws.push(Raw.fromArgs(talk, acc.date.clone()))
            return acc
        }, { raws: [], date: startDate }).raws;
        const endRaw = Raw.makeEnd(raws[raws.length - 1].startDate);

        this.raws = (() => {
            raws.unshift(startRaw)
            raws.push(endRaw)
            return raws
        })();
    }

    get description() {
        return this.raws.reduce((acc, raw, index) => {
            const d = raw.description
            return acc += (index === 0) ? d : `\n${d}`
        }, '');
    }
}

module.exports = Timetable
