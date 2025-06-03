class Manager {
    #array
    #addSzamlalasCallback

    constructor() {
        this.#array = []
    }

    setAddSzamlalasCallback(callback) {
        this.#addSzamlalasCallback = callback
    }

    addSzamlalas(szamlalas) {
        this.#array.push(szamlalas)
        this.#addSzamlalasCallback(szamlalas)
    }

    getAll() {
        return [...this.#array]
    }
}