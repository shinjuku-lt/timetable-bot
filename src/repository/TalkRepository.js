const Storage = require('../storage/OnMemoryStorage');

class TalkRepository {

    constructor(storage) {
        this.storage = storage;
    }

    fetchAll() {
        return Promise.resolve(this.storage.getAll());
    }

    save(id, talk) {
        return this.storage.save(id, talk);
    }

    delete(id) {
        return this.storage.delete(id);
    }

    deleteAll() {
        return this.storage.deleteAll();
    }

    static get shared() {
        return new TalkRepository(new Storage());
    }
}

module.exports = TalkRepository;
