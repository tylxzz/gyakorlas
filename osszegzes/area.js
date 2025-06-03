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
        const tbody = this.#createTable() 
        this.summaryDiv = document.createElement('div') 
        this.div.appendChild(this.summaryDiv)
        this.manager.setAddOsszegzesCallback(this.#addOsszegzesCallback(tbody))
        this.#updateSummary()
    }

    #addOsszegzesCallback(tbody) { 
        return (osszegzes) => { 
            this.#createOsszegzesRow(osszegzes, tbody)
            this.#updateSummary()
        }
    }

    #createOsszegzesRow(osszegzes, tbody) { 
        const tr = document.createElement('tr') 
        this.#createCell(tr, osszegzes.megnevezes) 
        this.#createCell(tr, osszegzes.hely) 
        this.#createCell(tr, osszegzes.honap) 
        const osszegCell = document.createElement('td')
        osszegCell.innerText = osszegzes.osszeg
        if (osszegzes.osszeg < 0) {
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

    #updateSummary() {
        const summary = this.manager.getSummary()
        this.summaryDiv.innerText = `Összes bevétel: ${summary.bevetel} Ft, összes kiadás: ${summary.kiadas} Ft`
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
                    const osszegzes = new Osszegzes(
                        fields[0], 
                        fields[1], 
                        fields[2], 
                        Number(fields[3])
                    )  
                    this.manager.addOsszegzes(osszegzes)  
                }
            }
            reader.readAsText(file) 
        }
    }
}