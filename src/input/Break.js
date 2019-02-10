class Break {

    constructor(duration) {
        this.title = 'break';
        this.duration = duration;
    }

    /**
     * dummy `user`
     *
     * - Note: dummy `uuid` gen
     * - TODO: refactoring
     */
    get user() {
        return {
            id: `id_${new Date().getTime()}`
        }
    }
}

module.exports = Break;
