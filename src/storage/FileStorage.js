/**
 * OnMermoy File Storage
 *
 * - Note: wrapper with `BotKit.json-file-store`
 * - SeeAlso: https://github.com/howdyai/botkit-docs/blob/master/docs/storage.md
 */
class FileStorage {

    /**
     * @param raw: botkit controller.storage
     */
    constructor(raw) {
        this._storage = raw;
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this._storage.all((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            this._storage.get(id, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    save(id, object) {
        const data = { id: id, object: object };
        return new Promise((resolve, reject) => {
            this._storage.save(data, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this._storage.delete(id, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    deleteAll() {
        return this.getAll()
            .then(result => result.forEach(r => this.delete(r.id)));
    }
}

module.exports = FileStorage;
