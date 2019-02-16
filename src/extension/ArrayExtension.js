module.exports = class ArrayExtension {
    /**
     * shuffle an array
     *
     * - SeeAlso: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
     */
    static shuffle(xs) {
        for (let i = xs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[xs[i], xs[j]] = [xs[j], xs[i]]
        }
        return xs
    }
}
