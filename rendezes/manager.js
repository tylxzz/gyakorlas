class Manager {
    #array
    #addRendezesCallback

    constructor() {
        this.#array = []
    }

    setAddRendezesCallback(callback) {
        this.#addRendezesCallback = callback
    }

    addRendezes(rendezes) {
        this.#array.push(rendezes)
        this.#addRendezesCallback(rendezes)
    }

    getAll() {
        return [...this.#array]
    }

    sortBy(field, order) {
        this.#array.sort((a, b) => {
            let va = a[field], vb = b[field]
            if (typeof va === "string") {
                va = va.toLowerCase()
                vb = vb.toLowerCase()
            }
            if (va < vb) return order === "asc" ? -1 : 1
            if (va > vb) return order === "asc" ? 1 : -1
            return 0
        })
        if (this.#addRendezesCallback) {
            this.#addRendezesCallback(null, true)
        }
    }
}