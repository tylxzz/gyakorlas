class Manager {
    #array
    #addSzuresCallback

    constructor() {
        this.#array = []
    }

    setAddSzuresCallback(callback) {
        this.#addSzuresCallback = callback
    }

    addSzures(szures) {
        this.#array.push(szures)
        this.#addSzuresCallback(szures)
    }

    getAll() {
        return [...this.#array]
    }
}