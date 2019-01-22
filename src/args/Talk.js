class Talk {

    constructor(userName, title, duration) {
        this.userName = userName;
        this.title = title;
        this.duration = duration;
    }

    static fromJson(json) {
        // TODO: error handling
        const args = json.text.split(" ")[1].split(",");
        return new Talk(
            json.requestUser.name,
            args[0],
            parseInt(args[1])
        )
    }
}

module.exports = Talk;
