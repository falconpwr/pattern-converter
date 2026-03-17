const { PDFDocument } = require("pdf-lib")
const fs = require("fs")
const path = require("path")

const CELL_SIZE = 18

module.exports = async function(pages){

  const pdf = await PDFDocument.create()

  // bezpieczna czcionka
  const font = await pdf.embedStandardFont("Helvetica")

  if(!fs.existsSync("outputs")){
    fs.mkdirSync("outputs")
  }

  for(const grid of pages){

    const cols = grid[0].length
    const rows = grid.length

    const width = cols * CELL_SIZE + 40
    const height = rows * CELL_SIZE + 40

    const page = pdf.addPage([width, height])

    for(let y=0; y<rows; y++){
      for(let x=0; x<cols; x++){

        let symbol = grid[y][x]

        // 🔥 zabezpieczenie
        if(!symbol || typeof symbol !== "string"){
          symbol = "."
        }

        const posX = 20 + x * CELL_SIZE
        const posY = height - (20 + y * CELL_SIZE)

        page.drawRectangle({
          x: posX,
          y: posY,
          width: CELL_SIZE,
          height: CELL_SIZE,
          borderWidth: (x%10===0||y%10===0)?1:0.2
        })

        page.drawText(symbol,{
          x: posX + 4,
          y: posY + 4,
          size: 10
        })

      }
    }
  }

  const bytes = await pdf.save()

  const filePath = path.resolve("outputs/result.pdf")

  fs.writeFileSync(filePath, bytes)

  console.log("PDF SIZE:", bytes.length)

  return filePath
}
