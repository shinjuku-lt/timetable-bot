/**
 * OnMermoy File Storage
 *
 * - Note: wrapper with `BotKit.json-file-store`
 * - SeeAlso: https://github.com/howdyai/botkit-docs/blob/master/docs/storage.md
 */
class FileStorage {

    /**
     * @param raw: botkit controller.storage
     *
     * - Note: using `storage.users` level
     */
    constructor(raw) {
        this._storage = raw.users;
    }

    async getAll() {
        this._storage.all((error, result) => {
            if (error) {
                throw error;
            } else {
                return result.map(r => r.object);
            }
        });
    }

    async save(id, object) {
        const data = { id: id, object: object };
        this._storage.save(data, (error) => {
            if (error) {
                throw error;
            } else {
                return;
            }
        });
    }

    async delete(id) {
        this._storage.delete(id, (error) => {
            if (error) {
                throw error;
            } else {
                return;
            }
        });
    }

    async deleteAll() {
        const result = await this.getAll();
        return result.map(value => {
            this.delete(value.id);
        });
    }
}

module.exports = FileStorage;
