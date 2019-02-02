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

    delete(key) {
        return this.map.delete(key);
    }
}

module.exports = OnMemoryStorage;
