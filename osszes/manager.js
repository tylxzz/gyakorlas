class Manager {
    #array
    #addOsszesCallback

    constructor() {
        this.#array = []
    }

    setAddOsszesCallback(callback) {
        this.#addOsszesCallback = callback
    }

    addOsszes(osszes) {
        this.#array.push(osszes)
        this.#addOsszesCallback(osszes)
    }

    getAll() {
        return [...this.#array]
    }

    searchByName(array, name) {
        return array.filter(o => o.megnevezes.toLowerCase().includes(name.toLowerCase()))
    }

    filterByHonap(array, honap, honapToKey) {
        return array.filter(o => honapToKey(o.honap) === honap)
    }

    customSort(array, field, order, honapToKey = null, honapok = null) {
        return [...array].sort((a, b) => {
            let va = a[field], vb = b[field]
            if (field === "honap" && honapToKey && honapok) {
                const vaIndex = honapok.indexOf(honapToKey(va))
                const vbIndex = honapok.indexOf(honapToKey(vb))
                if (vaIndex < vbIndex) return order === "asc" ? -1 : 1
                if (vaIndex > vbIndex) return order === "asc" ? 1 : -1
                return 0
            }
            if (typeof va === "number" && typeof vb === "number") {
                return order === "asc" ? va - vb : vb - va
            }
            if (typeof va === "string" && typeof vb === "string") {
                va = va.toLowerCase()
                vb = vb.toLowerCase()
                if (va < vb) return order === "asc" ? -1 : 1
                if (va > vb) return order === "asc" ? 1 : -1
                return 0
            }
            return 0
        })
    }

    getSummary(array) {
        let count = 0, osszeg = 0
        for (const o of array) {
            count++
            osszeg += o.osszeg
        }
        return { count, osszeg }
    }
}