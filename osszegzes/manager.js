class Manager {
    #array
    #addOsszegzesCallback

    constructor() {
        this.#array = []
    }

    setAddOsszegzesCallback(callback) {
        this.#addOsszegzesCallback = callback
    }

    addOsszegzes(osszegzes) {
        this.#array.push(osszegzes)
        this.#addOsszegzesCallback(osszegzes)
    }

    getSummary() {
        let bevetel = 0
        let kiadas = 0
        for (const t of this.#array) {
            if (t.osszeg < 0) kiadas += t.osszeg
            else bevetel += t.osszeg
        }
        return {
            bevetel: bevetel,
            kiadas: Math.abs(kiadas)
        }
    }
}