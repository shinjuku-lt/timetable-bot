/**
 * Synchronous OnMemory `Map` storage
 */
class OnMemoryStorage {
    constructor() {
        this.map = new Map()
    }

    getAll() {
        return [...this.map.values()]
    }

    get(key) {
        return this.map.get(key)
    }

    save(key, value) {
        return this.map.set(key, value)
    }

    delete(key) {
        return this.map.delete(key)
    }

    deleteAll() {
        return this.map.clear()
    }
}

module.exports = OnMemoryStorage
