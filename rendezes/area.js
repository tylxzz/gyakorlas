class Area {
    #div
    #manager

    get div() {
        return this.#div
    }

    get manager() { 
        return this.#manager 
    }

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

class Table extends Area {
    /**
     * 
     * @param {string} cssClass 
     * @param {Manager} manager 
     */
    constructor(cssClass, manager) { 
        super(cssClass, manager) 
        const form = document.createElement('form')
        form.style.marginBottom = "10px"

        const fields = [
            { value: "megnevezes", label: "Megnevezés" },
            { value: "hely", label: "Hely" },
            { value: "honap", label: "Hónap" },
            { value: "osszeg", label: "Összeg" }
        ]

        const fieldSelect = document.createElement('select')
        for (const f of fields) {
            const opt = document.createElement('option')
            opt.value = f.value
            opt.textContent = f.label
            fieldSelect.appendChild(opt)
        }

        const orderSelect = document.createElement('select')
        orderSelect.innerHTML = `
            <option value="asc">Növekvő</option>
            <option value="desc">Csökkenő</option>
        `

        const button = document.createElement('button')
        button.type = "submit"
        button.textContent = "Rendezés"

        form.appendChild(fieldSelect)
        form.appendChild(orderSelect)
        form.appendChild(button)
        this.div.appendChild(form)

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            manager.sortBy(fieldSelect.value, orderSelect.value)
        })

        this.tbody = this.#createTable() 
        this.manager.setAddRendezesCallback(this.#addRendezesCallback())
    }

    #addRendezesCallback() { 
        return (rendezes, rerender = false) => { 
            if (rerender) {
                this.#renderAll()
            } else if (rendezes) {
                this.#createRendezesRow(rendezes, this.tbody)
            }
        }
    }

    #renderAll() {
        this.tbody.innerHTML = ""
        for (const rendezes of this.manager.getAll()) {
            this.#createRendezesRow(rendezes, this.tbody)
        }
    }

    #createRendezesRow(rendezes, tbody) { 
        const tr = document.createElement('tr') 
        this.#createCell(tr, rendezes.megnevezes) 
        this.#createCell(tr, rendezes.hely) 
        this.#createCell(tr, rendezes.honap) 
        const osszegCell = document.createElement('td')
        osszegCell.innerText = rendezes.osszeg
        if (rendezes.osszeg < 0) {
            osszegCell.className = 'negativ-osszeg'
        } else {
            osszegCell.className = 'pozitiv-osszeg'
        }
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
    /**
     * 
     * @param {string} cssClass 
     * @param {Manager} manager 
     */
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
            const reader = new FileReader()  
            reader.onload = () => {  
                const lines = reader.result.split('\n')  
                for(const line of lines) {  
                    const trimmed = line.trim() 
                    const fields = trimmed.split(';')  
                    const rendezes = new Rendezes(
                        fields[0], 
                        fields[1], 
                        fields[2], 
                        Number(fields[3])
                    )  
                    this.manager.addRendezes(rendezes)  
                }
            }
            reader.readAsText(file) 
        }
    }
}