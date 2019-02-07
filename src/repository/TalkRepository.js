const FileStorage = require('../storage/FileStorage');

class TalkRepository {

    constructor(storage) {
        this.storage = storage;
    }

    fetchAll() {
        return this.storage.getAll()
            .then(result => result.map(r => r.object));
    }

    fetch(id) {
        return this.storage.get(id)
            .then(result => result.object);
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

    /**
     * provider
     */
    static withFile(botKitStorage) {
        const fileStorage = new FileStorage(botKitStorage);
        return new TalkRepository(fileStorage);
    }
}

module.exports = TalkRepository;
