class Area {
    #div
    #manager

    get div() { return this.#div }
    get manager() { return this.#manager }

    constructor(className, manager) {
        this.#manager = manager 
        const container = this.#getContainerDiv()
        this.#div = document.createElement('div') 
        this.#div.className = className 
        container.appendChild(this.#div) 
    }

    #getContainerDiv() { 
        let container = document.querySelector('.container')
        if(!container) {   
            container = document.createElement('div') 
            container.className = 'container' 
            document.body.appendChild(container) 
        }
        return container 
    }
}

class OsszesForm {
    constructor(onSubmit) {
        this.form = document.createElement('form')
        this.form.className = 'osszes-form'

        this.searchInput = document.createElement('input')
        this.searchInput.type = 'text'
        this.searchInput.placeholder = 'Keresés név szerint'
        this.searchInput.className = 'osszes-search'

        const honapok = [
            "", "jan", "feb", "mar", "apr", "maj", "jun",
            "jul", "aug", "szep", "okt", "nov", "dec"
        ]
        this.honapSelect = document.createElement('select')
        for (const honap of honapok) {
            const opt = document.createElement('option')
            opt.value = honap
            opt.textContent = honap === "" ? "Hónap (összes)" : honap.charAt(0).toUpperCase() + honap.slice(1)
            this.honapSelect.appendChild(opt)
        }

        const fields = [
            { value: "", label: "Nincs rendezés" },
            { value: "megnevezes", label: "Megnevezés" },
            { value: "hely", label: "Hely" },
            { value: "honap", label: "Hónap" },
            { value: "osszeg", label: "Összeg" }
        ]
        this.sortSelect = document.createElement('select')
        for (const f of fields) {
            const opt = document.createElement('option')
            opt.value = f.value
            opt.textContent = f.label
            this.sortSelect.appendChild(opt)
        }

        this.orderSelect = document.createElement('select')
        this.orderSelect.innerHTML = `
            <option value="asc">Növekvő</option>
            <option value="desc">Csökkenő</option>
        `

        this.button = document.createElement('button')
        this.button.type = "submit"
        this.button.textContent = "Szűrés/Rendezés"

        this.errorDiv = document.createElement('div')
        this.errorDiv.className = 'osszes-error'

        this.form.append(
            this.searchInput,
            this.honapSelect,
            this.sortSelect,
            this.orderSelect,
            this.button
        )

        this.form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.errorDiv.textContent = ""
            const keres = this.searchInput.value.trim()
            const honap = this.honapSelect.value
            const sortField = this.sortSelect.value
            const sortOrder = this.orderSelect.value

            if (!keres && !honap && !sortField) {
                this.errorDiv.textContent = "Legalább egy mezőt ki kell tölteni vagy választani!"
                onSubmit({ keres: "", honap: "", sortField: "", sortOrder: "" }, true)
                return
            }
            onSubmit({ keres, honap, sortField, sortOrder })
        })
    }
}

class Table extends Area {
    static HONAPOK = ["jan","feb","mar","apr","maj","jun","jul","aug","szep","okt","nov","dec"]

    constructor(cssClass, manager) { 
        super(cssClass, manager)

        this.osszesForm = new OsszesForm((options, isError) => {
            this.errorDiv.textContent = isError ? this.osszesForm.errorDiv.textContent : ""
            this.#renderAll(isError ? {} : options)
        })

        this.div.appendChild(this.osszesForm.form)
        this.errorDiv = this.osszesForm.errorDiv
        this.div.appendChild(this.errorDiv)

        this.countSpan = document.createElement('span')
        this.tbody = this.#createTable()
        this.div.appendChild(this.countSpan)

        this.manager.setAddOsszesCallback(this.#addOsszesCallback())
    }

    #addOsszesCallback() { 
        return () => { this.#renderAll() }
    }

    #renderAll(options = {}) {
        this.tbody.innerHTML = ""
        let data = this.manager.getAll()

        if (options.keres) {
            data = this.manager.searchByName(data, options.keres)
        }

        if (options.honap) {
            data = this.manager.filterByHonap(data, options.honap, this.#honapToKey)
        }

        if (options.sortField) {
            if (options.sortField === "honap") {
                data = this.manager.customSort(data, "honap", options.sortOrder, this.#honapToKey, Table.HONAPOK)
            } else {
                data = this.manager.customSort(data, options.sortField, options.sortOrder)
            }
        }

        const summary = this.manager.getSummary(data)
        for (const osszes of data) {
            this.#createOsszesRow(osszes, this.tbody)
        }
        this.countSpan.textContent = `A táblázatban ${summary.count} elem található, összegük: ${summary.osszeg} Ft`
    }

    #honapToKey(honap) {
        let key = honap
            .toLowerCase()
            .replace(/[áäâà]/g, "a")
            .replace(/[éëèê]/g, "e")
            .replace(/[íïîì]/g, "i")
            .replace(/[óöőôò]/g, "o")
            .replace(/[úüűùû]/g, "u");
        if (key.startsWith("sze")) return "szep";
        return key.slice(0, 3);
    }

    #createOsszesRow(osszes, tbody) { 
        const tr = document.createElement('tr') 
        this.#createCell(tr, osszes.megnevezes) 
        this.#createCell(tr, osszes.hely) 
        this.#createCell(tr, osszes.honap) 
        const osszegCell = document.createElement('td')
        osszegCell.innerText = osszes.osszeg
        osszegCell.className = osszes.osszeg < 0 ? 'negativ-osszeg' : 'pozitiv-osszeg'
        tr.appendChild(osszegCell)
        tbody.appendChild(tr) 
    }

    #createCell(row, textContent, type='td') {
        const cell = document.createElement(type) 
        cell.innerText = textContent 
        row.appendChild(cell) 
    }

    #createTable() { 
        const table = document.createElement('table')
        this.div.appendChild(table) 
        const thead = document.createElement('thead') 
        table.appendChild(thead) 
        const tr = document.createElement('tr') 
        thead.appendChild(tr) 
        const theadCells = ['Megnevezés', 'Hely', 'Hónap', 'Összeg'] 
        for(const content of theadCells) { 
            this.#createCell(tr, content, 'th')
        }
        const tbody = document.createElement('tbody')
        table.appendChild(tbody) 
        return tbody
    }
}

class Upload extends Area {
    constructor(cssClass, manager) { 
        super(cssClass, manager) 
        const input = document.createElement('input') 
        input.id = 'fileinput' 
        input.type = 'file' 
        this.div.appendChild(input) 
        input.addEventListener('change', this.#import()) 
    }

    #import() {
        return (e) => {
            const file = e.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = () => {
                const lines = reader.result.split('\n')
                for (const line of lines) {
                    const trimmed = line.trim()
                    const fields = trimmed.split(';')
                    const osszes = new Osszes(
                        fields[0],
                        fields[1],
                        fields[2],
                        Number(fields[3])
                    )
                    this.manager.addOsszes(osszes)
                }
            }
            reader.readAsText(file)
        }
    }
}