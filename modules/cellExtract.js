const sharp = require("sharp")

module.exports = async function(image, grid){

  if(!grid || !grid.cell){
    throw new Error("Invalid grid")
  }

  const { data, info } = await sharp(image)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const width = info.width
  const height = info.height

  const cellSize = grid.cell

  const cells = []

  for(let y = 0; y < grid.rows; y++){

    const row = []

    for(let x = 0; x < grid.cols; x++){

      const cell = []

      for(let cy = 0; cy < cellSize; cy++){
        for(let cx = 0; cx < cellSize; cx++){

          const px = x * cellSize + cx
          const py = y * cellSize + cy

          if(px >= width || py >= height) continue

          const idx = (py * width + px) * 3 // RGB
          cell.push(data[idx]) // tylko jeden kanał wystarczy
        }
      }

      row.push(cell)
    }

    cells.push(row)
  }

  console.log("CELLS DONE")

  return cells
}
