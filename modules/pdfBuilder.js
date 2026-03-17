const { PDFDocument } = require("pdf-lib")
const fs = require("fs")
const path = require("path")

const CELL_SIZE = 22

module.exports = async function(pages){

const pdf = await PDFDocument.create()

const fontBytes = fs.readFileSync("fonts/DejaVuSans.ttf")
const font = await pdf.embedFont(fontBytes)

// upewnij się że folder istnieje
if(!fs.existsSync("outputs")){
fs.mkdirSync("outputs")
}

for(const grid of pages){

const cols = grid[0].length
const rows = grid.length

const width = cols * CELL_SIZE + 100
const height = rows * CELL_SIZE + 100

const page = pdf.addPage([width,height])

for(let y=0;y<rows;y++){
for(let x=0;x<cols;x++){

const symbol = grid[y][x]

const posX = 50 + x * CELL_SIZE
const posY = height - (50 + y * CELL_SIZE)

page.drawRectangle({
x: posX,
y: posY,
width: CELL_SIZE,
height: CELL_SIZE,
borderWidth: (x%10===0||y%10===0)?1:0.2
})

page.drawText(symbol,{
x: posX + CELL_SIZE/4,
y: posY + CELL_SIZE/4,
size: CELL_SIZE * 0.6,
font
})

}
}

}

const bytes = await pdf.save()

const filePath = path.resolve("outputs/result.pdf")

fs.writeFileSync(filePath, bytes)

return filePath

}
