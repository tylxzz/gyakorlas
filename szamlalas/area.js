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

class Table extends Area {
    constructor(cssClass, manager) { 
        super(cssClass, manager)
        this.countSpan = document.createElement('span')
        this.tbody = this.#createTable()
        this.div.appendChild(this.countSpan)
        this.manager.setAddSzamlalasCallback(this.#addSzamlalasCallback())
    }

    #addSzamlalasCallback() { 
        return () => { this.#renderAll() }
    }

    #renderAll() {
        this.tbody.innerHTML = ""
        let count = 0
        for (const szamlalas of this.manager.getAll()) {
            this.#createSzamlalasRow(szamlalas, this.tbody)
            count++
        }
        this.countSpan.textContent = `A táblázatban ${count} elem található.`
    }

    #createSzamlalasRow(szamlalas, tbody) { 
        const tr = document.createElement('tr') 
        this.#createCell(tr, szamlalas.megnevezes) 
        this.#createCell(tr, szamlalas.hely) 
        this.#createCell(tr, szamlalas.honap) 
        const osszegCell = document.createElement('td')
        osszegCell.innerText = szamlalas.osszeg
        osszegCell.className = szamlalas.osszeg < 0 ? 'negativ-osszeg' : 'pozitiv-osszeg'
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
            const reader = new FileReader()  
            reader.onload = () => {  
                const lines = reader.result.split('\n')  
                for(const line of lines) {  
                    const trimmed = line.trim() 
                    const fields = trimmed.split(';')  
                    const szamlalas = new Szamlalas(
                        fields[0], 
                        fields[1], 
                        fields[2], 
                        Number(fields[3])
                    )  
                    this.manager.addSzamlalas(szamlalas)  
                }
            }
            reader.readAsText(file) 
        }
    }
}