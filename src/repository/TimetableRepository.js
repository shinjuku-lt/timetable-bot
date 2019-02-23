const Storage = require('../storage/OnMemoryStorage')

/**
 * outputed `Timetable` repository
 */
class TimetableRepository {
    constructor(storage) {
        this.storage = storage
    }

    /**
     * @param {date} id : showing date
     */
    fetch(id) {
        return this.storage.get(id)
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
