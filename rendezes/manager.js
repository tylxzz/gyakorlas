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

    #honapToKey(honap) {
        if (!honap) return ""
        let key = honap.toLowerCase()
            .replace(/[áäâà]/g, "a")
            .replace(/[éëèê]/g, "e")
            .replace(/[íïîì]/g, "i")
            .replace(/[óöőôò]/g, "o")
            .replace(/[úüűùû]/g, "u")
        if (key.startsWith("sze")) return "szep"
        return key.slice(0, 3)
    }

    sortBy(field, order) {
        const HONAPOK = ["jan","feb","mar","apr","maj","jun","jul","aug","szep","okt","nov","dec"]
        this.#array.sort((a, b) => {
            let va = a[field], vb = b[field]
            if (field === "honap") {
                const vaIndex = HONAPOK.indexOf(this.#honapToKey(va))
                const vbIndex = HONAPOK.indexOf(this.#honapToKey(vb))
                if (vaIndex < vbIndex) return order === "asc" ? -1 : 1
                if (vaIndex > vbIndex) return order === "asc" ? 1 : -1
                return 0
            }
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