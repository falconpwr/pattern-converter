const { PDFDocument } = require("pdf-lib")

const CELL_SIZE = 14
const CELLS_PER_PAGE = 50   // 🔥 kluczowa zmiana

module.exports = async function (pages) {

  const pdf = await PDFDocument.create()
  const font = await pdf.embedStandardFont("Helvetica")

  for (const grid of pages) {

    const rows = grid.length
    const cols = grid[0].length

    // 🔥 dzielenie na "kafelki"
    for (let startY = 0; startY < rows; startY += CELLS_PER_PAGE) {
      for (let startX = 0; startX < cols; startX += CELLS_PER_PAGE) {

        const page = pdf.addPage([
          CELLS_PER_PAGE * CELL_SIZE + 100,
          CELLS_PER_PAGE * CELL_SIZE + 100
        ])

        for (let y = 0; y < CELLS_PER_PAGE; y++) {
          for (let x = 0; x < CELLS_PER_PAGE; x++) {

            const globalY = startY + y
            const globalX = startX + x

            if (globalY >= rows || globalX >= cols) continue

            const symbol = grid[globalY][globalX]

            const posX = 50 + x * CELL_SIZE
            const posY = page.getHeight() - (50 + y * CELL_SIZE)

            page.drawRectangle({
              x: posX,
              y: posY,
              width: CELL_SIZE,
              height: CELL_SIZE,
              borderWidth: (globalX % 10 === 0 || globalY % 10 === 0) ? 1 : 0.2
            })

            page.drawText(symbol, {
              x: posX + CELL_SIZE / 4,
              y: posY + CELL_SIZE / 4,
              size: CELL_SIZE * 0.6,
              font
            })
          }
        }

      }
    }
  }

  const bytes = await pdf.save()

  require("fs").writeFileSync("pattern.pdf", bytes)

  return "pattern.pdf"
}
