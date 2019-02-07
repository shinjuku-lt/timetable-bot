const FileStorage = require('../storage/FileStorage');

class TalkRepository {

    constructor(storage) {
        this.storage = storage;
    }

    fetchAll() {
        return this.storage.getAll();
    }

    save(userId, talk) {
        return this.storage.save(userId, talk);
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

    // TODO: impl
    static withMongo() {
    }
}

module.exports = TalkRepository;
