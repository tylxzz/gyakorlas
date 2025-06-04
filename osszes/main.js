const manager = new Manager()
const upload = new Upload('upload', manager)
const table = new Table('table', manager)
const form = new OsszesForm('form', manager)

document.body.appendChild(upload.div)
document.body.appendChild(table.div)
