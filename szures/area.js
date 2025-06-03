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

        const honapok = [
            "", "jan", "feb", "mar", "apr", "maj", "jun",
            "jul", "aug", "szep", "okt", "nov", "dec"
        ]

        const honapSelect = document.createElement('select')
        for (const honap of honapok) {
            const opt = document.createElement('option')
            opt.value = honap
            opt.textContent = honap === "" ? "" : honap.charAt(0).toUpperCase() + honap.slice(1)
            honapSelect.appendChild(opt)
        }

        const button = document.createElement('button')
        button.type = "submit"
        button.textContent = "Szűrés"

        form.appendChild(honapSelect)
        form.appendChild(button)
        this.div.appendChild(form)

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            this.#renderAll(honapSelect.value)
        })

        this.tbody = this.#createTable() 
        this.manager.setAddSzuresCallback(this.#addSzuresCallback())
    }

    #addSzuresCallback() { 
        return (szures, rerender = false) => { 
            if (rerender) {
                this.#renderAll()
            } else if (szures) {
                this.#createSzuresRow(szures, this.tbody)
            }
        }
    }

    #renderAll(honapFilter = "") {
        this.tbody.innerHTML = ""
        for (const szures of this.manager.getAll()) {
            if (!honapFilter || this.#honapToKey(szures.honap) === honapFilter) {
                this.#createSzuresRow(szures, this.tbody)
            }
        }
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

    #createSzuresRow(szures, tbody) { 
        const tr = document.createElement('tr') 
        this.#createCell(tr, szures.megnevezes) 
        this.#createCell(tr, szures.hely) 
        this.#createCell(tr, szures.honap) 
        const osszegCell = document.createElement('td')
        osszegCell.innerText = szures.osszeg
        if (szures.osszeg < 0) {
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
                    if (fields.length < 4) continue
                    const szures = new Szures(
                        fields[0], 
                        fields[1], 
                        fields[2], 
                        Number(fields[3])
                    )  
                    this.manager.addSzures(szures)  
                }
            }
            reader.readAsText(file) 
        }
    }
}