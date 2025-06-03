class Rendezes {
    /**
     * @type {string}
     */
    #megnevezes
    /**
     * @type {string}
     */
    #hely
    /**
     * @type {string}
     */
    #honap
    /**
     * @type {number}
     */
    #osszeg

    /**
     * @returns {string}
     */
    get megnevezes() {
        return this.#megnevezes
    }

    /**
     * @returns {string}
     */
    get hely() {
        return this.#hely 
    }

    /**
     * @returns {string}
     */
    get honap() {
        return this.#honap 
    }

    /**
     * @returns {number}
     */
    get osszeg() {
        return this.#osszeg
    }

    /**
     * 
     * @param {string} megnevezes 
     * @param {string} hely
     * @param {string} honap 
     * @param {number} osszeg
     */
    constructor(megnevezes, hely, honap, osszeg) { 
        this.#megnevezes = megnevezes 
        this.#hely = hely 
        this.#honap = honap
        this.#osszeg = osszeg 
    }
}