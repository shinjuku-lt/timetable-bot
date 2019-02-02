/**
 * Synchronous OnMemory Map store
 */
class OnMemoryStorage {
    constructor() {
        this.map = new Map()
    }

    getAll() {
        return [ ...this.map.values() ];
    }

    save(key, value) {
        return this.map.set(key, value);
    }

    deleteAll() {
        return this.map.clear();
    }
}

module.exports = OnMemoryStorage;
