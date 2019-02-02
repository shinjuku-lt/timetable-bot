const Storage = require('./storage/OnMemoryStorage');

class TalkRepository {

    constructor(storage) {
        this.storage = storage;
    }

    static get shared() {
        return new TalkRepository(new Storage);
    }

    fetchAll() {
        return new Promise((resolve, reject) => {
            resolve(this.storage.getAll());
        });
    }

    save(userId, talk) {
        this.storage.save(userId, talk);
    }

    delete(userId) {
        this.storage.delete(userId);
    }
}

module.exports = TalkRepository;
