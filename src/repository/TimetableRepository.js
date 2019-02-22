const Storage = require('../storage/OnMemoryStorage')

/**
 * outputed `Timetable` repository
 *
 * - TODO:
 *   use mongo storage
 *   https://github.com/shinjuku-lt/timetable-bot/issues/24
 */
class TimetableRepository {
    constructor(storage) {
        this.storage = storage
    }

    /**
     * @param {date} id : showing date
     */
    fetch(id) {
        return this.storage.fetch(id)
    }

    save(id, timetable) {
        return this.storage.save(id, timetable)
    }

    delete(id) {
        return this.storage.delete(id)
    }

    static get shared() {
        return new TimetableRepository(new Storage())
    }
}

module.exports = TimetableRepository
