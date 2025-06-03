const manager = new Manager()
const upload = new Upload('upload', manager)
const table = new Table('table', manager)

document.body.appendChild(upload.div)
document.body.appendChild(table.div)
